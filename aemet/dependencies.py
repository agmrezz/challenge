from datetime import datetime
from typing import Tuple

from fastapi import HTTPException, Query


def parse_dates(date: str, name: str):
    try:
        return datetime.strptime(date, "%Y-%m-%dT%H:%M:%SUTC")
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid {name} date format")


def validate_dates(
        start_date: str = Query(description="must match: AAAA-MM-DDTHH:MM:SSUTC"),
        end_date: str = Query(description="must match: AAAA-MM-DDTHH:MM:SSUTC")
) -> Tuple[datetime, datetime]:
    """
    Dependency for validating start and end dates.
    
    Args:
        start_date (str): Start date in format YYYY-MM-DDTHH:MM:SSUTC
        end_date (str): End date in format YYYY-MM-DDTHH:MM:SSUTC
        
    Returns:
        Tuple[datetime, datetime]: Parsed start and end dates
    """
    start = parse_dates(start_date, "start")
    end = parse_dates(end_date, "end")

    if start >= end:
        raise HTTPException(
            status_code=400,
            detail="start_date must be before end_date"
        )

    return start, end
