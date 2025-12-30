from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.auth_service.db.session import get_session
from app.auth_service.models.user import User
from app.auth_service.schemas.user import UserCreate
from app.auth_service.core.security import get_password_hash

router = APIRouter(tags=["Signup"])


@router.post("/signup")
async def signup(
    user_data: UserCreate,
    session: AsyncSession = Depends(get_session)
):
    # Check if user already exists
    result = await session.execute(
        select(User).where(User.email == user_data.email)
    )
    existing_user = result.scalar_one_or_none()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        hashed_password=hashed_password,
        is_active=True
    )
    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)

    return {"message": "User created successfully", "user_id": new_user.id}
