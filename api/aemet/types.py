from enum import Enum

from pydantic import BaseModel, HttpUrl


class AntarcticStation(str, Enum):
    """
    Custom str Enum for Antarctic stations
    This achieves two things:
        - Have OpenAPI docs so the actual name of the station
        - Have the station_id available in the same object without requiring a lookup
    """
    GABRIEL_DE_CASTILLA = ("Meteo Station Gabriel de Castilla", "89070")
    JUAN_CARLOS_1 = ("Meteo Station Juan Carlos I", "89064")

    def __new__(cls, value, station_id):
        obj = str.__new__(cls, value)
        obj._value_ = value
        obj.station_id = station_id
        return obj


class TimeAggregation(str, Enum):
    h = "Hourly"
    d = "Daily"
    ME = "Monthly"


class PossibleFields(str, Enum):
    TEMPERATURE = "temp"
    PRESSURE = "pres"
    WIND_VELOCITY = "vel"


class AEMETDateFilterResponse(BaseModel):
    descripcion: str
    estado: int
    datos: HttpUrl | None = None
    metadatos: HttpUrl | None = None
