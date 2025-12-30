import os
from psycopg_pool import ConnectionPool

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/reservation_db")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set")

pool = ConnectionPool(
    DATABASE_URL,
    min_size=1,
    max_size=10,
    timeout=10,
)
