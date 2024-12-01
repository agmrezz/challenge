from typing import Annotated

from fastapi import APIRouter, Depends
from pandas import DataFrame
import numpy as np

from .dependencies import AEMETQueryHandler, AEMETQueryHandlerV2

router = APIRouter(
    prefix="/antarctic",
    tags=["antarctic"]
)

aemet_antarctic_query_handler = AEMETQueryHandler(
    "/antartida/datos/fechaini/${start_date}UTC/fechafin/${end_date}UTC/estacion/${station_id}")

aemet_antarctic_query_handler_v2 = AEMETQueryHandlerV2(
    "/antartida/datos/fechaini/${start_date}UTC/fechafin/${end_date}UTC/estacion/${station_id}")


@router.get("/{station}")
async def get_antarctic_station(df: Annotated[DataFrame, Depends(aemet_antarctic_query_handler)]):
    return df.replace(np.nan, None).to_dict(orient="index")

@router.get("/v2/{station}")
async def get_antarctic_station_v2(df: Annotated[DataFrame, Depends(aemet_antarctic_query_handler_v2)]):
    return df.replace(np.nan, None).to_dict(orient="index")
