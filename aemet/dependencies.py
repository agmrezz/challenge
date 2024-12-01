from datetime import datetime
from string import Template
from typing import Tuple, Annotated

import pandas as pd
import requests
from fastapi import HTTPException, Query, Depends

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
        df["fhora"] = pd.to_datetime(df["fhora"], utc=True)
        df = df[["fhora", *filtered_fields]]
        if resolution:
            df = df.resample(resolution.name, on='fhora').mean(numeric_only=True)
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
