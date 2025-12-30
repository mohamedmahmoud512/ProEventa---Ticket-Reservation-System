from dotenv import load_dotenv
from app.auth_service.api.v1 import auth_router, signup_router, users_router
load_dotenv()

from fastapi import FastAPI

app = FastAPI()

app.include_router(auth_router, prefix="/api/v1")
app.include_router(signup_router, prefix="/api/v1")
app.include_router(users_router, prefix="/api/v1")
