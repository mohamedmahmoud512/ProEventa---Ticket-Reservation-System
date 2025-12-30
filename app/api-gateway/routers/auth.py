from fastapi import APIRouter, Request, Depends
import httpx
from ..core.dependencies import get_current_user, get_current_user_optional

router = APIRouter()

AUTH_SERVICE_URL = "http://auth-service:8000"

# Public endpoints that don't require authentication
PUBLIC_ENDPOINTS = ["login", "signup"]

@router.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def forward_auth_request(path: str, request: Request, user_id: str = Depends(get_current_user_optional)):
    async with httpx.AsyncClient(timeout=10.0) as client:
        url = f"{AUTH_SERVICE_URL}/api/v1/{path}"

        # Check if this is a public endpoint
        is_public = any(public in path for public in PUBLIC_ENDPOINTS)

        # If not public and no user_id, block the request
        if not is_public and user_id is None:
            return {"error": "Authentication required"}

        headers = {k: v for k, v in request.headers.items() if k.lower() not in ["host", "content-length"]}

        # Add user_id to headers for internal services if authenticated
        if user_id:
            headers["X-User-ID"] = user_id

        try:
            response = await client.request(
                method=request.method,
                url=url,
                headers=headers,
                content=await request.body()
            )
            return response.json()
        except httpx.TimeoutException:
            return {"error": "Request to auth service timed out"}
        except httpx.HTTPStatusError as e:
            return {"error": f"Auth service error: {e.response.status_code}"}
        except Exception as e:
            return {"error": f"Failed to forward request to auth service: {str(e)}"}
