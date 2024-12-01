from sqlmodel import Session
from typing import Annotated

from .database import get_session

from fastapi import Depends

DBSession = Annotated[Session, Depends(get_session)]
