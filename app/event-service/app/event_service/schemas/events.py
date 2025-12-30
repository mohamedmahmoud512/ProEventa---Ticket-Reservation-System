from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class EventCreate(BaseModel):
    name: str
    start_time: datetime
    venue_id: int

class EventResponse(BaseModel):
    id: int
    name: str
    start_time: datetime
