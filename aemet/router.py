from fastapi import APIRouter, HTTPException

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
    raise HTTPException(status_code=501, detail="Not implemented yet")
