from fastapi import APIRouter, Request, Depends, HTTPException
import httpx
from ..core.dependencies import get_current_user

router = APIRouter()

EVENT_SERVICE_URL = "http://event-service:8001"

@router.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def forward_event_request(path: str, request: Request, user_id: str = Depends(get_current_user)):
    async with httpx.AsyncClient(timeout=10.0) as client:
        url = f"{EVENT_SERVICE_URL}/api/v1/{path}"
        headers = {k: v for k, v in request.headers.items() if k.lower() not in ["host", "content-length"]}

        # Add user_id to headers for internal services
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
            return {"error": "Request to event service timed out"}
        except httpx.HTTPStatusError as e:
            return {"error": f"Event service error: {e.response.status_code}"}
        except Exception as e:
            return {"error": f"Failed to forward request to event service: {str(e)}"}
