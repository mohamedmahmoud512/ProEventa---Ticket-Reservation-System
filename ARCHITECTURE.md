# Architecture Documentation

## System Architecture

### Overview

ProEventa follows a microservices architecture pattern, separating concerns into independent, scalable services. The system is designed for high availability, scalability, and maintainability.

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Browser                         │
│                    (HTML/JavaScript/CSS)                      │
└────────────────────────────┬──────────────────────────────────┘
                             │
                             │ HTTP/HTTPS
                             │
┌────────────────────────────▼──────────────────────────────────┐
│                      API Gateway                              │
│                    (FastAPI - Port 8000)                      │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  • Request Routing                                     │  │
│  │  • Authentication Middleware                           │  │
│  │  • Request/Response Transformation                     │  │
│  │  • Error Handling                                     │  │
│  └────────────────────────────────────────────────────────┘  │
└─────┬──────────────────┬──────────────────┬──────────────────┘
      │                  │                  │
      │                  │                  │
┌─────▼─────┐    ┌──────▼──────┐    ┌──────▼──────┐
│   Auth    │    │    Event    │    │ Reservation │
│  Service  │    │   Service   │    │   Service   │
│ Port 8001 │    │  Port 8002  │    │  Port 8003  │
└─────┬─────┘    └──────┬──────┘    └──────┬──────┘
      │                 │                  │
      └─────────────────┴──────────────────┘
                       │
              ┌────────▼────────┐
              │   PostgreSQL    │
              │   Database      │
              │   Port 5432     │
              └─────────────────┘
```

## Components

### 1. Frontend (Client-Side Application)

**Location**: `booking/`

**Technology Stack**:
- HTML5
- Vanilla JavaScript (ES6+)
- CSS3

**Responsibilities**:
- User interface rendering
- User interaction handling
- API communication
- Client-side state management
- Authentication token management

**Key Features**:
- Single Page Application (SPA) behavior
- Responsive design
- Client-side routing
- Local storage for authentication

### 2. API Gateway

**Location**: `Ticket-reservation/app/api-gateway/`

**Technology Stack**:
- FastAPI (Python)
- Uvicorn (ASGI server)
- HTTPX (HTTP client)

**Responsibilities**:
- Single entry point for all client requests
- Request routing to appropriate microservices
- Authentication and authorization
- Request/response transformation
- Error handling and standardization
- Rate limiting (can be added)
- CORS handling

**Key Components**:
- **Routers**: Route handlers for different services
  - `routers/auth.py`: Authentication routes
  - `routers/events.py`: Event routes
  - `routers/reservations.py`: Reservation routes
- **Core Utilities**:
  - `core/dependencies.py`: Dependency injection for authentication
  - `core/security.py`: Security utilities (JWT verification)

**Request Flow**:
1. Client sends request to API Gateway
2. Gateway validates authentication (if required)
3. Gateway forwards request to appropriate service
4. Service processes request and returns response
5. Gateway returns response to client

### 3. Auth Service

**Location**: `Ticket-reservation/app/auth-service/`

**Technology Stack**:
- FastAPI
- SQLModel/SQLAlchemy
- PostgreSQL
- JWT for token generation

**Responsibilities**:
- User registration
- User authentication (login)
- JWT token generation
- User profile management
- Password hashing and verification

**API Endpoints**:
- `POST /api/v1/signup` - User registration
- `POST /api/v1/login` - User authentication
- `GET /api/v1/users/{user_id}` - Get user profile

**Data Models**:
- User model with email, password hash, profile information

### 4. Event Service

**Location**: `Ticket-reservation/app/event-service/`

**Technology Stack**:
- FastAPI
- SQLModel/SQLAlchemy
- PostgreSQL

**Responsibilities**:
- Event creation and management
- Event listing and search
- Event details retrieval
- Event availability checking

**API Endpoints**:
- `GET /api/v1/events` - List all events
- `GET /api/v1/events/{event_id}` - Get event details
- `POST /api/v1/events` - Create new event
- `PUT /api/v1/events/{event_id}` - Update event
- `DELETE /api/v1/events/{event_id}` - Delete event

**Data Models**:
- Event model with name, description, start_time, venue_id, etc.

### 5. Reservation Service

**Location**: `Ticket-reservation/app/reservation-service/`

**Technology Stack**:
- FastAPI
- SQLModel/SQLAlchemy
- PostgreSQL

**Responsibilities**:
- Ticket reservation creation
- Reservation management (view, cancel)
- Seat availability checking
- Reservation status tracking

**API Endpoints**:
- `POST /api/v1/reservations/reserve` - Create reservation
- `GET /api/v1/reservations/user/{user_id}` - Get user reservations
- `GET /api/v1/reservations/event/{event_id}` - Get event reservations
- `DELETE /api/v1/reservations/{reservation_id}` - Cancel reservation

**Data Models**:
- Reservation model with event_id, user_id, seat_id, status, etc.

### 6. Database

**Technology**: PostgreSQL 13

**Responsibilities**:
- Data persistence
- Transaction management
- Data integrity

**Database Structure**:
- Separate databases or schemas for each service (optional)
- Connection pooling
- Async database operations

## Communication Patterns

### Inter-Service Communication

Services communicate through the API Gateway using HTTP/REST:
- Synchronous request/response pattern
- JSON payload format
- Standard HTTP status codes

### Authentication Flow

1. User submits credentials to `/auth/login`
2. Auth Service validates credentials
3. Auth Service generates JWT token
4. Token returned to client
5. Client includes token in subsequent requests
6. API Gateway validates token before forwarding requests

### Request Flow Example

**User Books a Ticket**:
1. Client → API Gateway: `POST /reservations/reservations/reserve` (with JWT)
2. API Gateway validates JWT token
3. API Gateway → Reservation Service: Forward request with user context
4. Reservation Service validates event availability
5. Reservation Service creates reservation in database
6. Reservation Service → API Gateway: Return reservation details
7. API Gateway → Client: Return response

## Security

### Authentication

- **JWT Tokens**: Stateless authentication using JSON Web Tokens
- **Token Storage**: Client-side (localStorage)
- **Token Validation**: API Gateway validates tokens before forwarding requests

### Authorization

- **Role-Based Access Control**: Can be implemented using JWT claims
- **Resource-Level Authorization**: Services can check user permissions

### Data Security

- **Password Hashing**: Passwords are hashed using secure algorithms (bcrypt)
- **HTTPS**: Recommended for production deployments
- **Input Validation**: Pydantic schemas validate all inputs

## Scalability

### Horizontal Scaling

Each service can be scaled independently:
- Multiple instances of each service
- Load balancing at API Gateway level
- Database connection pooling

### Database Scaling

- Read replicas for read-heavy operations
- Database sharding (if needed)
- Connection pooling

## Error Handling

### Error Response Format

```json
{
  "error": "Error message",
  "status_code": 400
}
```

### Error Types

- **400 Bad Request**: Invalid input
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

## Monitoring and Logging

### Logging

- Each service logs requests and errors
- Structured logging format
- Log aggregation (can be added)

### Health Checks

- `/health` endpoint on API Gateway
- Service health monitoring
- Database connection health

## Deployment Architecture

### Docker Compose Setup

All services are containerized:
- Each service has its own Dockerfile
- Docker Compose orchestrates all services
- Shared network for inter-service communication
- Volume mounts for persistent data

### Service Discovery

- Services discover each other using service names in Docker network
- Hardcoded service URLs in development
- Service registry can be added for production

## Technology Choices

### Why FastAPI?

- High performance (async support)
- Automatic API documentation
- Type hints and validation
- Modern Python features

### Why Microservices?

- Separation of concerns
- Independent scaling
- Technology flexibility
- Team autonomy

### Why PostgreSQL?

- ACID compliance
- Rich feature set
- Excellent performance
- Strong community support

## Future Enhancements

### Potential Improvements

1. **Message Queue**: Add message queue (RabbitMQ/Kafka) for async operations
2. **Caching**: Implement Redis for caching
3. **Service Mesh**: Add service mesh for advanced routing
4. **API Versioning**: Implement API versioning strategy
5. **GraphQL**: Consider GraphQL for flexible queries
6. **Event Sourcing**: For audit trails and event history
7. **Distributed Tracing**: Add tracing (Jaeger, Zipkin)
8. **Metrics**: Add Prometheus metrics

## Development Workflow

### Local Development

1. Services run independently
2. Hot reload enabled for development
3. Environment variables for configuration
4. Local database for testing

### Testing Strategy

- Unit tests for business logic
- Integration tests for API endpoints
- End-to-end tests for critical flows

## Configuration Management

### Environment Variables

Each service uses environment variables for:
- Database connection strings
- Secret keys
- Service URLs
- Feature flags

### Configuration Files

- `docker-compose.yml`: Service orchestration
- `requirements.txt`: Python dependencies
- `.env`: Environment-specific configuration

