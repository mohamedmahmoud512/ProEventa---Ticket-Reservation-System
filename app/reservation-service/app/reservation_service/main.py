from dotenv import load_dotenv
from app.reservation_service.api.v1.reservations import router as reservations_router
load_dotenv()

from fastapi import FastAPI

app = FastAPI()

app.include_router(reservations_router, prefix="/api/v1")
