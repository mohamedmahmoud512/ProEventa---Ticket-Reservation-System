from dotenv import load_dotenv
from app.event_service.api.v1.events import router as events_router
load_dotenv()

from fastapi import FastAPI

app = FastAPI()

app.include_router(events_router, prefix="/api/v1")
