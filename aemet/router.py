from datetime import datetime
from typing import Annotated, Tuple

from fastapi import APIRouter, Depends

from .dependencies import validate_dates
from .stations import AntarcticStation

router = APIRouter(
    prefix="/antarctic",
    tags=["antarctic"]
)


@router.get("/{station}")
async def get_antarctic_station(
        station: AntarcticStation,
        dates: Annotated[Tuple[datetime, datetime], Depends(validate_dates)]
):
    """
    Get data for a specific Antarctic station within a date range.
    
    Args:
        station (AntarcticStation): The Antarctic station to get data for
        dates (Tuple[datetime, datetime]): Tuple containing validated start and end dates
        
    Returns:
        dict: Station data within the specified date range
    """
    start_date, end_date = dates

    # TODO: Implement station data retrieval
    return {
        "station": station,
        "station_id": station.station_id,
        "start_date": start_date,
        "end_date": end_date
    }
