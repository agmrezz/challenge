from fastapi import APIRouter

from settings.settings import get_settings

router = APIRouter(
    prefix="/antarctic",
    tags=["antarctic"]
)


@router.get("/{station}")
async def get_antarctic_station(station: str):
    """
    Get data for a specific Antarctic station.
    
    Args:
        station (str): The station identifier
        
    Returns:
        dict: Station data
    """
    # TODO: Implement station data retrieval
    return get_settings().aemet_base_url
