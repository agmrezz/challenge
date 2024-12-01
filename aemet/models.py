from datetime import datetime
from sqlmodel import SQLModel, Field, Index

class AEMETStationData(SQLModel, table=True):
    __table_args__ = (
        Index('idx_station_timestamp', 'station_code', 'timestamp', unique=True),
    )
    
    id: int = Field(default=None, primary_key=True)
    station_code: str
    timestamp: datetime
    temperature: float | None
    pressure: float | None
    wind_velocity: float | None
