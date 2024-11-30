from datetime import datetime
from typing import Annotated, Tuple

from fastapi import APIRouter, Depends, Query

from .dependencies import validate_dates
from .types import AntarcticStation, TimeAggregation, PossibleFields

router = APIRouter(
    prefix="/antarctic",
    tags=["antarctic"]
)


@router.get("/{station}")
async def get_antarctic_station(
        station: AntarcticStation,
        dates: Annotated[Tuple[datetime, datetime], Depends(validate_dates)],
        fields: Annotated[list[PossibleFields] | None, Query(description="Fields to retrieve. Empty means all")] = None,
        resolution: Annotated[TimeAggregation | None, Query(description="Aggregate data by time resolution")] = None
):
    """
    Get data for a specific Antarctic station within a date range.
    
    Args:
        station (AntarcticStation): The Antarctic station to get data for
        dates (Tuple[datetime, datetime]): Tuple containing validated start and end dates
        fields (list[str]): List of fields to retrieve (temp, pres, vel). Empty means all fields
        resolution (TimeResolution, optional): Time resolution (hourly, daily, monthly)
        
    Returns:
        dict: Station data within the specified date range
    """
    start_date, end_date = dates
    # TODO: Implement station data retrieval
    return {
        "station": station,
        "station_id": station.station_id,
        "start_date": start_date,
        "end_date": end_date,
        "fields": fields or [x for x in PossibleFields],
        "resolution": resolution
    }
