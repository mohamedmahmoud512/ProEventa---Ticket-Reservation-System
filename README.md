# ProEventa - Ticket Reservation System

A comprehensive ticket reservation system for movies, theatres, and events. This project consists of a modern web frontend and a microservices-based backend architecture.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Frontend Documentation](#frontend-documentation)
- [Backend Documentation](#backend-documentation)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Overview

ProEventa is a full-stack ticket reservation system that allows users to:
- Browse movies and events
- View theatre information
- Book tickets for movies and events
- Manage reservations
- Handle payments
- View user profiles

The system is built with a microservices architecture, ensuring scalability, maintainability, and separation of concerns.

## Architecture

The project follows a microservices architecture pattern:

```
┌─────────────────┐
│   Frontend      │
│  (HTML/JS/CSS)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   API Gateway   │
│    (FastAPI)    │
└────────┬────────┘
         │
    ┌────┴────┬──────────┬──────────────┐
    ▼         ▼          ▼              ▼
┌────────┐ ┌────────┐ ┌──────────┐ ┌──────────┐
│  Auth  │ │ Event  │ │Reservation│ │Database │
│Service │ │Service │ │  Service │ │(Postgres)│
└────────┘ └────────┘ └──────────┘ └──────────┘
```

### Components

1. **Frontend**: Client-side web application in the `booking/` directory
2. **API Gateway**: Single entry point for all API requests (`Ticket-reservation/app/api-gateway/`)
3. **Auth Service**: Handles user authentication and authorization
4. **Event Service**: Manages events and event-related operations
5. **Reservation Service**: Handles ticket reservations and bookings
6. **Database**: PostgreSQL database for data persistence

## Features

### User Features
- User registration and authentication
- Browse movies and events
- View event details and availability
- Book tickets for movies and events
- Manage reservations (view, cancel)
- User profile management
- Payment processing

### Admin Features
- Event management
- User management
- Reservation oversight

## Project Structure

```
.
├── booking/                          # Frontend application
│   ├── assets/                       # Images and static assets
│   ├── *.html                        # HTML pages
│   ├── *.js                          # JavaScript modules
│   ├── style.css                     # Stylesheet
│   ├── config.js                     # Configuration
│   ├── api.js                        # API service layer
│   └── README-API.md                 # Frontend API documentation
│
└── Ticket-reservation/               # Backend microservices
    ├── docker-compose.yml            # Docker orchestration
    └── app/
        ├── api-gateway/              # API Gateway service
        │   ├── main.py               # Gateway entry point
        │   ├── routers/              # Route handlers
        │   │   ├── auth.py
        │   │   ├── events.py
        │   │   └── reservations.py
        │   ├── core/                 # Core utilities
        │   │   ├── dependencies.py   # Dependency injection
        │   │   └── security.py       # Security utilities
        │   ├── Dockerfile
        │   └── requirements.txt
        │
        ├── auth-service/             # Authentication service
        │   ├── app/auth_service/
        │   │   ├── main.py
        │   │   ├── api/v1/           # API endpoints
        │   │   ├── core/             # Core logic
        │   │   ├── db/               # Database session
        │   │   ├── models/           # Data models
        │   │   └── schemas/          # Pydantic schemas
        │   ├── Dockerfile
        │   └── requirements.txt
        │
        ├── event-service/            # Event management service
        │   ├── app/event_service/
        │   │   ├── main.py
        │   │   ├── api/v1/
        │   │   ├── db/
        │   │   └── schemas/
        │   ├── Dockerfile
        │   └── requirements.txt
        │
        └── reservation-service/      # Reservation service
            ├── app/reservation_service/
            │   ├── main.py
            │   ├── api/v1/
            │   ├── db/
            │   └── schemas/
            ├── Dockerfile
            └── requirements.txt
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (for frontend development, optional)
- Python 3.9+ (for local development, optional)

### Quick Start with Docker

1. **Clone the repository** (if applicable)

2. **Navigate to the backend directory**:
   ```bash
   cd Ticket-reservation
   ```

3. **Start all services**:
   ```bash
   docker-compose up --build
   ```

   This will start:
   - PostgreSQL database on port 5432
   - Auth Service on port 8001
   - Event Service on port 8002
   - Reservation Service on port 8003
   - API Gateway on port 8000

4. **Access the services**:
   - API Gateway: http://localhost:8000
   - API Documentation: http://localhost:8000/docs
   - Frontend: Open `booking/Home.html` in a web browser

### Local Development Setup

#### Backend Services

1. **Set up Python virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies for each service**:
   ```bash
   cd app/api-gateway
   pip install -r requirements.txt
   ```

3. **Set environment variables**:
   Create `.env` files in each service directory with:
   - `DATABASE_URL`: PostgreSQL connection string
   - `SECRET_KEY`: Secret key for JWT tokens

4. **Run services individually**:
   ```bash
   # API Gateway
   cd app/api-gateway
   uvicorn main:app --reload --port 8000

   # Auth Service
   cd app/auth-service/app
   uvicorn auth_service.main:app --reload --port 8001

   # Event Service
   cd app/event-service/app
   uvicorn event_service.main:app --reload --port 8002

   # Reservation Service
   cd app/reservation-service/app
   uvicorn reservation_service.main:app --reload --port 8003
   ```

#### Frontend

1. **Navigate to the frontend directory**:
   ```bash
   cd booking
   ```

2. **Configure API endpoint**:
   Edit `config.js` to set the correct `API_BASE_URL`:
   ```javascript
   API_BASE_URL: 'http://localhost:8000'
   ```

3. **Open in browser**:
   - Simply open `Home.html` in a web browser
   - Or use a local web server:
     ```bash
     python -m http.server 8080
     # Then visit http://localhost:8080/Home.html
     ```

## Frontend Documentation

The frontend is a client-side web application built with vanilla JavaScript, HTML, and CSS.

### Key Files

- **`Home.html`**: Landing page with movies and events
- **`movies.html`**: Movies listing page
- **`events.html`**: Events listing page
- **`detail.html`**: Event/movie detail page
- **`booking.html`**: Ticket booking interface
- **`payment.html`**: Payment processing page
- **`profile.html`**: User profile page
- **`login.html`**: Authentication page
- **`theatres.html`**: Theatre information page

### JavaScript Modules

- **`api.js`**: API service layer for backend communication
- **`auth.js`**: Authentication utilities
- **`config.js`**: Application configuration
- **`data.js`**: Data management utilities
- **`booking.js`**: Booking logic
- **`events.js`**: Events management
- **`movies.js`**: Movies management
- **`payment.js`**: Payment processing
- **`profile.js`**: User profile management

### API Integration

The frontend uses the `ApiService` object to communicate with the backend:

```javascript
// Authentication
await ApiService.auth.login({ email, password });
await ApiService.auth.signup({ email, password });

// Events
await ApiService.events.getEvents();
await ApiService.events.getEventById(id);

// Reservations
await ApiService.reservations.makeReservation(data);
await ApiService.reservations.getUserReservations(userId);
```

For detailed frontend API documentation, see [booking/README-API.md](booking/README-API.md).

## Backend Documentation

### API Gateway

The API Gateway serves as the single entry point for all client requests. It:
- Routes requests to appropriate microservices
- Handles authentication and authorization
- Manages request/response transformation
- Provides unified error handling

**Port**: 8000

**Endpoints**:
- `/` - Health check
- `/health` - Health status
- `/auth/*` - Authentication routes
- `/events/*` - Event routes
- `/reservations/*` - Reservation routes
- `/docs` - Swagger API documentation

### Auth Service

Handles user authentication and authorization.

**Port**: 8001

**Features**:
- User registration
- User login with JWT tokens
- User profile management
- Token validation

**Endpoints** (via API Gateway):
- `POST /auth/signup` - Register new user
- `POST /auth/login` - User login
- `GET /auth/users/{user_id}` - Get user profile

### Event Service

Manages events and event-related operations.

**Port**: 8002

**Features**:
- Event creation and management
- Event listing and search
- Event details retrieval

**Endpoints** (via API Gateway):
- `GET /events/events` - List all events
- `GET /events/events/{event_id}` - Get event details
- `POST /events/events` - Create new event

### Reservation Service

Handles ticket reservations and bookings.

**Port**: 8003

**Features**:
- Create reservations
- View user reservations
- Cancel reservations
- Check event availability

**Endpoints** (via API Gateway):
- `POST /reservations/reservations/reserve` - Make reservation
- `GET /reservations/reservations/user/{user_id}` - Get user reservations
- `GET /reservations/reservations/event/{event_id}` - Get event reservations
- `DELETE /reservations/reservations/{reservation_id}` - Cancel reservation

## Database Schema

The system uses PostgreSQL as the database. All tables use UUID as primary keys for better distributed system compatibility.

### Tables Overview

The database consists of 5 main tables:
- `users` - User accounts and authentication
- `venues` - Venue/location information
- `events` - Events hosted at venues
- `seats` - Seat information for venues
- `reservations` - Ticket reservations

### Entity Relationship Diagram

```
┌──────────┐         ┌──────────┐         ┌──────────┐
│  users   │         │  venues │         │  seats  │
├──────────┤         ├──────────┤         ├──────────┤
│ id (PK)  │         │ id (PK)  │◄────────│ id (PK)  │
│ email    │         │ name     │         │ venue_id │
│ password │         │ location │         │ row      │
│ created  │         └──────────┘         │ seat_num │
└────┬─────┘              │                └────┬─────┘
     │                    │                     │
     │                    │                     │
     │              ┌─────▼──────┐              │
     │              │   events   │              │
     │              ├────────────┤              │
     │              │ id (PK)    │              │
     │              │ venue_id   │              │
     │              │ name       │              │
     │              │ start_time │              │
     │              └─────┬──────┘              │
     │                    │                     │
     └────────────────────┼─────────────────────┘
                          │
                   ┌──────▼──────────┐
                   │  reservations   │
                   ├─────────────────┤
                   │ id (PK)         │
                   │ user_id (FK)    │
                   │ event_id (FK)   │
                   │ seat_id (FK)    │
                   │ status          │
                   │ expires_at      │
                   │ created_at      │
                   └─────────────────┘
```

### Table Definitions

#### users

Stores user account information and authentication data.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PRIMARY KEY, NOT NULL, DEFAULT `uuid_generate_v4()` | Unique user identifier |
| `email` | `text` | NOT NULL, UNIQUE | User email address |
| `password_hash` | `text` | NOT NULL | Hashed password |
| `created_at` | `timestamp` | NOT NULL, DEFAULT `now()` | Account creation timestamp |

**Indexes**:
- Primary key on `id`
- Unique constraint on `email`

**Relationships**:
- Referenced by: `reservations.user_id`

---

#### venues

Stores venue/location information where events are hosted.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PRIMARY KEY, NOT NULL, DEFAULT `uuid_generate_v4()` | Unique venue identifier |
| `name` | `text` | NOT NULL | Venue name |
| `location` | `text` | NULLABLE | Venue location/address |

**Indexes**:
- Primary key on `id`

**Relationships**:
- Referenced by: `events.venue_id`
- Referenced by: `seats.venue_id`

---

#### events

Stores event information including name, venue, and start time.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PRIMARY KEY, NOT NULL, DEFAULT `uuid_generate_v4()` | Unique event identifier |
| `venue_id` | `uuid` | NOT NULL, FOREIGN KEY → `venues.id` | Venue hosting the event |
| `name` | `text` | NOT NULL | Event name |
| `start_time` | `timestamp` | NOT NULL | Event start date and time |

**Indexes**:
- Primary key on `id`

**Foreign Keys**:
- `venue_id` references `venues(id)`

**Relationships**:
- Referenced by: `reservations.event_id`

---

#### seats

Stores seat information for each venue, including row and seat number.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PRIMARY KEY, NOT NULL, DEFAULT `uuid_generate_v4()` | Unique seat identifier |
| `venue_id` | `uuid` | NOT NULL, FOREIGN KEY → `venues.id` | Venue containing the seat |
| `row` | `text` | NOT NULL | Seat row identifier (e.g., "A", "B", "1", "2") |
| `seat_number` | `integer` | NOT NULL | Seat number within the row |

**Indexes**:
- Primary key on `id`
- Unique constraint on `(venue_id, row, seat_number)` - ensures no duplicate seats

**Foreign Keys**:
- `venue_id` references `venues(id)`

**Relationships**:
- Referenced by: `reservations.seat_id`

---

#### reservations

Stores ticket reservations with status tracking and expiration handling.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PRIMARY KEY, NOT NULL, DEFAULT `uuid_generate_v4()` | Unique reservation identifier |
| `user_id` | `uuid` | NOT NULL, FOREIGN KEY → `users.id` | User who made the reservation |
| `event_id` | `uuid` | NOT NULL, FOREIGN KEY → `events.id` | Event being reserved |
| `seat_id` | `uuid` | NOT NULL, FOREIGN KEY → `seats.id` | Seat being reserved |
| `status` | `text` | NOT NULL, CHECK constraint | Reservation status |
| `expires_at` | `timestamp` | NOT NULL | Reservation expiration time |
| `created_at` | `timestamp` | NOT NULL, DEFAULT `now()` | Reservation creation timestamp |

**Status Values** (CHECK constraint):
- `held` - Temporarily held (e.g., during checkout)
- `confirmed` - Confirmed reservation
- `canceled` - Canceled reservation
- `expired` - Expired reservation

**Indexes**:
- Primary key on `id`
- Index on `event_id` for faster event-based queries
- Partial index on `expires_at` WHERE `status = 'held'` for efficient expiration cleanup
- Unique constraint on `(event_id, seat_id)` WHERE `status IN ('reserved', 'confirmed')` - prevents double booking

**Foreign Keys**:
- `user_id` references `users(id)`
- `event_id` references `events(id)`
- `seat_id` references `seats(id)`

**Business Rules**:
- Only one active reservation (status: `reserved` or `confirmed`) per seat per event
- Expired reservations can be automatically cleaned up using the partial index on `expires_at`

---

### Key Design Decisions

1. **UUID Primary Keys**: All tables use UUID instead of auto-incrementing integers for better distributed system compatibility and to avoid ID conflicts.

2. **Status Management**: The `reservations` table uses a status field with CHECK constraint to ensure data integrity. The status lifecycle typically flows: `held` → `confirmed` → `canceled` or `expired`.

3. **Seat Uniqueness**: The unique constraint on `(venue_id, row, seat_number)` ensures no duplicate seats exist within a venue.

4. **Double Booking Prevention**: The unique constraint on `(event_id, seat_id)` for active reservations prevents double booking of the same seat for the same event.

5. **Expiration Handling**: The partial index on `expires_at` for held reservations allows efficient cleanup of expired temporary reservations.

6. **Timestamps**: All tables include creation timestamps for audit trails and debugging.

### Database Queries Examples

**Get all events for a venue**:
```sql
SELECT * FROM events WHERE venue_id = 'venue-uuid';
```

**Get available seats for an event**:
```sql
SELECT s.* FROM seats s
WHERE s.venue_id = (
    SELECT venue_id FROM events WHERE id = 'event-uuid'
)
AND s.id NOT IN (
    SELECT seat_id FROM reservations
    WHERE event_id = 'event-uuid'
    AND status IN ('held', 'confirmed')
);
```

**Get user's active reservations**:
```sql
SELECT r.*, e.name as event_name, e.start_time
FROM reservations r
JOIN events e ON r.event_id = e.id
WHERE r.user_id = 'user-uuid'
AND r.status IN ('held', 'confirmed')
ORDER BY e.start_time;
```

**Clean up expired held reservations**:
```sql
UPDATE reservations
SET status = 'expired'
WHERE status = 'held'
AND expires_at < NOW();
```

## API Documentation

### Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Example Requests

#### Register User
```bash
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### Get Events
```bash
curl -X GET http://localhost:8000/events/events \
  -H "Authorization: Bearer <token>"
```

#### Make Reservation
```bash
curl -X POST http://localhost:8000/reservations/reservations/reserve \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "event_id": 1,
    "seat_id": 1,
    "user_id": 1
  }'
```

### Interactive API Documentation

Once the services are running, you can access interactive API documentation:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Development

### Code Structure

- **Frontend**: Modular JavaScript with separation of concerns
- **Backend**: Microservices with FastAPI
- **API Gateway**: Request routing and authentication middleware

### Environment Variables

#### API Gateway
- `SECRET_KEY`: Secret key for JWT token verification

#### Services
- `DATABASE_URL`: PostgreSQL connection string
  - Format: `postgresql+asyncpg://user:password@host:port/database`

### Testing

1. **Test API Gateway**:
   ```bash
   curl http://localhost:8000/health
   ```

2. **Test Authentication**:
   ```bash
   curl -X POST http://localhost:8000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com", "password": "test"}'
   ```

3. **Test Frontend**:
   - Open browser developer tools
   - Check network tab for API requests
   - Test API calls in console

## Deployment

### Docker Deployment

1. **Build and start services**:
   ```bash
   docker-compose up -d --build
   ```

2. **Check service status**:
   ```bash
   docker-compose ps
   ```

3. **View logs**:
   ```bash
   docker-compose logs -f [service-name]
   ```

### Production Considerations

1. **Environment Variables**: Use secure environment variable management
2. **HTTPS**: Configure SSL/TLS certificates
3. **Database**: Use managed database service or configure backups
4. **Secrets**: Use secret management service (e.g., AWS Secrets Manager)
5. **Monitoring**: Set up logging and monitoring (e.g., Prometheus, Grafana)
6. **Load Balancing**: Configure load balancer for API Gateway
7. **CORS**: Configure CORS settings for production domain

### Frontend Deployment

1. **Static Hosting**: Deploy to static hosting service (e.g., Netlify, Vercel, AWS S3)
2. **Update API URL**: Set `API_BASE_URL` in `config.js` to production API Gateway URL
3. **Build Optimization**: Minify JavaScript and CSS files
4. **CDN**: Use CDN for static assets

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

[Specify your license here]

## Support

For issues and questions, please [create an issue](link-to-issues) or contact the development team.

