from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.auth_service.db.session import get_session
from app.auth_service.models.user import User
from app.auth_service.schemas.auth import LoginRequest
from app.auth_service.core.security import verify_password, create_access_token

router = APIRouter(tags=["Auth"])


@router.post("/login")
async def login(
    data: LoginRequest,
    session: AsyncSession = Depends(get_session)
):
    result = await session.execute(
        select(User).where(User.email == data.email)
    )
    user = result.scalar_one_or_none()

    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": str(user.id)})

    return {
        "access_token": token,
        "token_type": "bearer"
    }
