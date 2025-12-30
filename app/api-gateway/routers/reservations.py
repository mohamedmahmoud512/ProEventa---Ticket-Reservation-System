from fastapi import APIRouter, Request
import httpx

router = APIRouter()

RESERVATION_SERVICE_URL = "http://reservation-service:8002"

@router.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def forward_reservation_request(path: str, request: Request):
    async with httpx.AsyncClient(timeout=10.0) as client:
        url = f"{RESERVATION_SERVICE_URL}/api/v1/{path}"
        try:
            response = await client.request(
                method=request.method,
                url=url,
                headers={k: v for k, v in request.headers.items() if k.lower() not in ["host", "content-length"]},
                content=await request.body()
            )
            return response.json()
        except httpx.TimeoutException:
            return {"error": "Request to reservation service timed out"}
        except httpx.HTTPStatusError as e:
            return {"error": f"Reservation service error: {e.response.status_code}"}
        except Exception as e:
            return {"error": f"Failed to forward request to reservation service: {str(e)}"}
