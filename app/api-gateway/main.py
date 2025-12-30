from fastapi import FastAPI
from routers.auth import router as auth_router
from routers.events import router as events_router
from routers.reservations import router as reservations_router

app = FastAPI(
    title="API Gateway",
    description="Gateway for ticket reservation microservices",
    version="1.0.0"
)

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(events_router, prefix="/events", tags=["Events"])
app.include_router(reservations_router, prefix="/reservations", tags=["Reservations"])

@app.get("/")
async def root():
    return {"message": "API Gateway is running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
