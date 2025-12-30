from pydantic import BaseModel

class ReservationCreate(BaseModel):
    event_id: int
    seat_id: int
    user_id: int
