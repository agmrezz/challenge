from datetime import datetime, timedelta
from string import Template
from typing import Tuple, Annotated

from loguru import logger
import pandas as pd
import requests
from fastapi import HTTPException, Query, Depends, Path
from sqlmodel import Session, select

from aemet.models import AEMETStationData
from database.dependencies import DBSession
from settings.settings import get_settings
from .types import AntarcticStation, TimeAggregation, PossibleFields, AEMETDateFilterResponse


def parse_dates(date: str, name: str):
    try:
        return datetime.strptime(date, "%Y-%m-%dT%H:%M:%SUTC")
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid {name} date format")


def validate_dates(
        start_date: str = Query(description="must match: AAAA-MM-DDTHH:MM:SSUTC"),
        end_date: str = Query(description="must match: AAAA-MM-DDTHH:MM:SSUTC")
) -> Tuple[datetime, datetime]:
    """
    Dependency for validating start and end dates.
    
    Args:
        start_date (str): Start date in format YYYY-MM-DDTHH:MM:SSUTC
        end_date (str): End date in format YYYY-MM-DDTHH:MM:SSUTC
        
    Returns:
        Tuple[datetime, datetime]: Parsed start and end dates
    """
    start = parse_dates(start_date, "start")
    end = parse_dates(end_date, "end")

    if start >= end:
        raise HTTPException(
            status_code=400,
            detail="start_date must be before end_date"
        )

    return start, end


class DateRange:
    def __init__(self, start: datetime, end: datetime):
        self.start = start
        self.end = end

    def __repr__(self):
        return f"DateRange({self.start} - {self.end})"


class AEMETQueryHandlerV2:
    def __init__(self, endpoint_url: str):
        self.url = Template(f"{get_settings().aemet_base_url}{endpoint_url}")

    def __call__(self, *, db: DBSession,
                 station: str = Path(description="Station code"),
                 dates: Annotated[Tuple[datetime, datetime], Depends(validate_dates)],
                 fields: Annotated[list[PossibleFields] | None, Query()] = None,
                 resolution: Annotated[TimeAggregation | None, Query()] = None):
        logger.debug(f"Fetching data for station {station} from {dates[0]} to {dates[1]}")
        start_date, end_date = dates

        # Get cached data and missing ranges
        cached_df, missing_ranges = self._get_cached_data(db, station, start_date, end_date)

        # Fetch missing data if needed
        if missing_ranges:
            # Flatten the list of split ranges
            split_ranges = [
                date_range
                for range in missing_ranges
                for date_range in self._split_date_range(range.start, range.end)
            ]
            logger.debug(f"Fetching missing data for station {station} from {dates[0]} to {dates[1]}")
            dfs = [cached_df] if not cached_df.empty else []
            for date_range in split_ranges:
                df = self._fetch_from_api(station, date_range.start, date_range.end)
                self._cache_data(db, df, station)
                dfs.append(df)

            # Combine all dataframes
            df = pd.concat(dfs)
        else:
            df = cached_df

        # Apply filters and aggregations
        filtered_fields = fields if fields else [x for x in PossibleFields]
        logger.debug(f"Applying filters and aggregations for station {station} with fields {filtered_fields} and resolution {resolution}")
        df = df[["fhora", *filtered_fields]]
        df["fhora"] = pd.to_datetime(df["fhora"], utc=True).dt.tz_convert('Europe/Madrid')
        if resolution:
            df = df.resample(resolution.name, on='fhora').mean(numeric_only=True)
        else:
            df = df.set_index("fhora")

        return df.sort_index()

    def _get_cached_data(self, db: Session, station_id: str, start_date: datetime, end_date: datetime) -> tuple[
        pd.DataFrame, list[DateRange]]:
        statement = select(AEMETStationData).order_by(AEMETStationData.timestamp).where(
            AEMETStationData.station_code == station_id,
            AEMETStationData.timestamp >= start_date,
            AEMETStationData.timestamp <= end_date)
        results = db.exec(statement).all()

        if not results:
            logger.debug(f"No cached data found for station {station_id} from {start_date} to {end_date}")
            return pd.DataFrame(), [DateRange(start_date, end_date)]

        logger.debug(f"Found {len(results)} cached data for station {station_id} from {start_date} to {end_date}")

        # Convert results to DataFrame
        df = pd.DataFrame([{
            'fhora': r.timestamp,
            'temp': r.temperature,
            'pres': r.pressure,
            'vel': r.wind_velocity
        } for r in results])

        # Find missing ranges
        missing_ranges = []
        timestamps = [r.timestamp for r in results]
        # Check start gap
        if timestamps[0] > start_date:
            # API returns data every 10 minutes, so we need to get the previous 10 minutes
            next_date = timestamps[0] - timedelta(minutes=10)
            missing_ranges.append(DateRange(start_date, next_date))

        # Check end gap
        if timestamps[-1] < end_date:
            next_date = timestamps[-1] + timedelta(minutes=10)
            missing_ranges.append(DateRange(next_date, end_date))

        logger.debug(f"Found {missing_ranges} missing ranges for station {station_id} from {start_date} to {end_date}")

        return df, missing_ranges

    def _split_date_range(self, start_date: datetime, end_date: datetime) -> list[DateRange]:
        """Split a date range into chunks of maximum 30 days."""
        ranges = []
        current_start = start_date
        
        while current_start < end_date:
            # Calculate the next end date (30 days or less)
            next_end = min(
                current_start + timedelta(days=30),
                end_date
            )
            
            ranges.append(DateRange(current_start, next_end))
            current_start = next_end + timedelta(minutes=10)  # Add 10 minutes to avoid overlap
    
        return ranges

    def _cache_data(self, db: Session, df: pd.DataFrame, station_id: str):
        logger.debug(f"Caching data for station {station_id} from {df.index[0]} to {df.index[-1]}")
        for _, row in df.iterrows():
            weather_data = AEMETStationData(
                station_code=station_id,
                timestamp=row['fhora'],
                temperature=row.get('temp'),
                pressure=row.get('pres'),
                wind_velocity=row.get('vel')
            )
            db.add(weather_data)
        db.commit()

    def _fetch_from_api(self, station: str, start_date: datetime, end_date: datetime) -> pd.DataFrame:
        logger.debug(f"Fetching data for station {station} from {start_date} to {end_date}")
        file_url = self.url.substitute(
            station_id=station,
            start_date=start_date.isoformat(),
            end_date=end_date.isoformat())

        file_query_response = AEMETDateFilterResponse(**self._handle_get_request(file_url))
        df = pd.DataFrame(self._handle_get_request(str(file_query_response.datos)))
        df["fhora"] = pd.to_datetime(df["fhora"], utc=True)
        return df

    @staticmethod
    def _handle_get_request(url: str):
        try:
            logger.debug(f"Fetching data from {url}")
            response = requests.get(url, headers={"api_key": get_settings().aemet_jwt})
            data = response.json()

            # AEMET api return 200 regardless and then the real status code in the response
            # For filter requests, these are always returned.
            # However, for data requests, they are only returned when the request fails.
            status_code = data.get("estado") if "estado" in data else 200
            description = data.get("descripcion") if "descripcion" in data else None

            if 400 <= status_code <= 599:
                logger.error(f"Aemet api returned status code {status_code} with description {description}")
                raise HTTPException(status_code=status_code, detail=description)
            if not status_code:
                logger.error("Aemet api returned no status code")
                raise HTTPException(status_code=404, detail="No data found")

            return data
        except Exception as e:
            logger.error(f"Aemet api return an error: {e}")
            raise HTTPException(status_code=500, detail=f"Aemet api return an error: {e}")


class AEMETQueryHandler:
    def __init__(self, endpoint_url: str):
        self.url = Template(f"{get_settings().aemet_base_url}{endpoint_url}")

    def __call__(self, station: AntarcticStation,
                 dates: Annotated[Tuple[datetime, datetime], Depends(validate_dates)],
                 fields: Annotated[
                     list[PossibleFields] | None, Query(description="Fields to retrieve. Empty means all")] = None,
                 resolution: Annotated[
                     TimeAggregation | None, Query(description="Aggregate data by time resolution")] = None):
        start_date, end_date = dates

        file_url = self.url.substitute(
            station_id=station.station_id,
            start_date=start_date.isoformat(),
            end_date=end_date.isoformat())
        print("fetching data from aemet", file_url)
        file_query_response = AEMETDateFilterResponse(**self._handle_get_request(file_url))
        df = pd.DataFrame(self._handle_get_request(str(file_query_response.datos)))

        filtered_fields = fields if fields else [x for x in PossibleFields]
        df["fhora"] = pd.to_datetime(df["fhora"], utc=True).dt.tz_convert('Europe/Madrid')
        df = df[["fhora", *filtered_fields]]
        if resolution:
            df = df.resample(resolution.name, on='fhora').mean(numeric_only=True)
        else:
            df = df.set_index("fhora")
        return df

    @staticmethod
    def _handle_get_request(url: str):
        try:
            response = requests.get(url, headers={"api_key": get_settings().aemet_jwt})
            data = response.json()

            # AEMET api return 200 regardless and then the real status code in the response
            # For filter requests, these are always returned.
            # However, for data requests, they are only returned when the request fails.
            status_code = data.get("estado") if "estado" in data else 200
            description = data.get("descripcion") if "descripcion" in data else None

            if 400 <= status_code <= 599:
                raise HTTPException(status_code=status_code, detail=description)
            if not status_code:
                raise HTTPException(status_code=404, detail="No data found")

            return data
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Aemet api return an error: {e}")
