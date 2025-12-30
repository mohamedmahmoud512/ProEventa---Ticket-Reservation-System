from fastapi import APIRouter, HTTPException
from app.reservation_service.db.session import pool
from psycopg import errors
from app.reservation_service.schemas.reservation import ReservationCreate
import httpx

router = APIRouter(prefix="/reservations", tags=["Reservations"])


@router.post("/reserve")
async def reserve_ticket(payload: ReservationCreate):
    event_id = payload.event_id
    seat_id = payload.seat_id
    user_id = payload.user_id

    # Validate event exists by calling event service
    async with httpx.AsyncClient() as client:
        response = await client.get(f"http://event-service:8002/api/v1/events/{event_id}")
        if response.status_code != 200:
            raise HTTPException(400, "Invalid event_id")

    # Validate user exists by calling auth service
    async with httpx.AsyncClient() as client:
        response = await client.get(f"http://auth-service:8001/api/v1/users/{user_id}")
        if response.status_code != 200:
            raise HTTPException(400, "Invalid user_id")

    try:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute("BEGIN;")

                # lock seat (assuming seats table exists in reservation db)
                cur.execute(
                    """
                    SELECT id
                    FROM seats
                    WHERE id = %s
                    FOR UPDATE;
                    """,
                    (seat_id,),
                )

                if not cur.fetchone():
                    raise HTTPException(400, "Seat not found")

                # check if already reserved
                cur.execute(
                    """
                    SELECT 1
                    FROM reservations
                    WHERE seat_id = %s;
                    """,
                    (seat_id,),
                )

                if cur.fetchone():
                    raise HTTPException(400, "Seat already reserved")

                # insert reservation
                cur.execute(
                    """
                    INSERT INTO reservations (event_id, seat_id, user_id)
                    VALUES (%s, %s, %s)
                    RETURNING id;
                    """,
                    (event_id, seat_id, user_id),
                )

                reservation_id = cur.fetchone()[0]
                conn.commit()

    except HTTPException:
        raise

    except errors.ForeignKeyViolation:
        raise HTTPException(400, "Invalid event_id or user_id")

    except Exception:
        raise HTTPException(500, "Reservation failed")

    return {
        "reservation_id": reservation_id,
        "status": "confirmed",
    }


@router.get("/user/{user_id}")
def get_user_reservations(user_id: int):
    with pool.connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, event_id, seat_id
                FROM reservations
                WHERE user_id = %s;
                """,
                (user_id,),
            )
            rows = cur.fetchall()

    return [
        {
            "reservation_id": r[0],
            "event_id": r[1],
            "seat_id": r[2],
        }
        for r in rows
    ]


@router.get("/event/{event_id}")
def get_event_reservations(event_id: int):
    with pool.connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, seat_id, user_id
                FROM reservations
                WHERE event_id = %s;
                """,
                (event_id,),
            )
            rows = cur.fetchall()

    return [
        {
            "reservation_id": r[0],
            "seat_id": r[1],
            "user_id": r[2],
        }
        for r in rows
    ]


@router.delete("/{reservation_id}")
def cancel_reservation(reservation_id: int):
    with pool.connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                DELETE FROM reservations
                WHERE id = %s
                RETURNING id;
                """,
                (reservation_id,),
            )

            deleted = cur.fetchone()
            conn.commit()

    if not deleted:
        raise HTTPException(404, "Reservation not found")

    return {"status": "cancelled"}
