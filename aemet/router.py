from typing import Annotated

from fastapi import APIRouter, Depends
from pandas import DataFrame

from .dependencies import AEMETQueryHandler

router = APIRouter(
    prefix="/antarctic",
    tags=["antarctic"]
)

aemet_antarctic_query_handler = AEMETQueryHandler(
    "/antartida/datos/fechaini/${start_date}UTC/fechafin/${end_date}UTC/estacion/${station_id}")


@router.get("/{station}")
async def get_antarctic_station(df: Annotated[DataFrame, Depends(aemet_antarctic_query_handler)]):
    return df.to_dict(orient="index")
