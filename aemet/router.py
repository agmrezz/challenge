from fastapi import APIRouter

from .stations import AntarcticStation

router = APIRouter(
    prefix="/antarctic",
    tags=["antarctic"]
)


@router.get("/{station}")
async def get_antarctic_station(station: AntarcticStation):
    """
    Get data for a specific Antarctic station.
    
    Args:
        station (AntarcticStation): The Antarctic station to get data for
        
    Returns:
        dict: Station data
    """
    # TODO: Implement station data retrieval
    return station, station.station_id
