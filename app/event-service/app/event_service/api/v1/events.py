from fastapi import APIRouter, HTTPException, status
from app.event_service.db.session import pool
from psycopg import errors
from app.event_service.schemas.events import EventCreate, EventResponse

router = APIRouter()


@router.get("/events", response_model=list[EventResponse])
def list_events():
    query = """
        SELECT id, name, start_time
        FROM events
        ORDER BY start_time;
    """

    with pool.connection() as conn:
        with conn.cursor() as cur:
            cur.execute(query)
            rows = cur.fetchall()

    return [
        EventResponse(
            id=row[0],
            name=row[1],
            start_time=row[2],
        )
        for row in rows
    ]


@router.post(
    "/events",
    response_model=EventResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_event(event: EventCreate):
    query = """
        INSERT INTO events (name, start_time, venue_id)
        VALUES (%s, %s, %s)
        RETURNING id, name, start_time;
    """

    try:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    query,
                    (event.name, event.start_time, event.venue_id),
                )
                row = cur.fetchone()
                conn.commit()

    except errors.ForeignKeyViolation:
        raise HTTPException(
            status_code=400,
            detail="Invalid venue_id",
        )

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Failed to create event",
        )

    return EventResponse(
        id=row[0],
        name=row[1],
        start_time=row[2],
    )
