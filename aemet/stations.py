from enum import Enum


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
