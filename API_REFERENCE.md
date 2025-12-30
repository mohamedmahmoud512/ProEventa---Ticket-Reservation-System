# API Reference

Complete API reference for the ProEventa ticket reservation system.

## Base URL

- **Development**: `http://localhost:8000`
- **Production**: `https://api.yourdomain.com`

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Getting a Token

1. Register a new user or login
2. Extract `access_token` from the response
3. Include it in subsequent requests

## Endpoints

### Authentication Endpoints

#### Register User

```http
POST /auth/signup
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "email": "user@example.com",
  "message": "User created successfully"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid input data
- `409 Conflict`: Email already exists

---

#### Login

```http
POST /auth/login
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response** (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid credentials

---

#### Get User Profile

```http
GET /auth/users/{user_id}
Authorization: Bearer <token>
```

**Path Parameters**:
- `user_id` (integer): User ID

**Response** (200 OK):
```json
{
  "id": 1,
  "email": "user@example.com",
  "created_at": "2024-01-01T00:00:00Z"
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: User not found

---

### Event Endpoints

#### List All Events

```http
GET /events/events
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "name": "Concert",
    "start_time": "2024-01-15T20:00:00Z"
  },
  {
    "id": 2,
    "name": "Movie Screening",
    "start_time": "2024-01-16T18:00:00Z"
  }
]
```

---

#### Get Event by ID

```http
GET /events/events/{event_id}
Authorization: Bearer <token>
```

**Path Parameters**:
- `event_id` (integer): Event ID

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "Concert",
  "start_time": "2024-01-15T20:00:00Z",
  "venue_id": 1,
  "description": "Live concert performance"
}
```

**Error Responses**:
- `404 Not Found`: Event not found

---

#### Create Event

```http
POST /events/events
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "New Concert",
  "start_time": "2024-02-01T20:00:00Z",
  "venue_id": 1,
  "description": "Event description"
}
```

**Response** (201 Created):
```json
{
  "id": 3,
  "name": "New Concert",
  "start_time": "2024-02-01T20:00:00Z",
  "venue_id": 1
}
```

**Error Responses**:
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Missing or invalid token

---

### Reservation Endpoints

#### Make Reservation

```http
POST /reservations/reservations/reserve
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "event_id": 1,
  "seat_id": 5,
  "user_id": 1
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "event_id": 1,
  "user_id": 1,
  "seat_id": 5,
  "status": "confirmed",
  "created_at": "2024-01-10T10:00:00Z"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid input or seat already reserved
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Event or seat not found

---

#### Get User Reservations

```http
GET /reservations/reservations/user/{user_id}
Authorization: Bearer <token>
```

**Path Parameters**:
- `user_id` (integer): User ID

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "event_id": 1,
    "user_id": 1,
    "seat_id": 5,
    "status": "confirmed",
    "created_at": "2024-01-10T10:00:00Z"
  }
]
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token

---

#### Get Event Reservations

```http
GET /reservations/reservations/event/{event_id}
Authorization: Bearer <token>
```

**Path Parameters**:
- `event_id` (integer): Event ID

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "event_id": 1,
    "user_id": 1,
    "seat_id": 5,
    "status": "confirmed"
  },
  {
    "id": 2,
    "event_id": 1,
    "user_id": 2,
    "seat_id": 6,
    "status": "confirmed"
  }
]
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Event not found

---

#### Cancel Reservation

```http
DELETE /reservations/reservations/{reservation_id}
Authorization: Bearer <token>
```

**Path Parameters**:
- `reservation_id` (integer): Reservation ID

**Response** (200 OK):
```json
{
  "message": "Reservation cancelled successfully"
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User doesn't own this reservation
- `404 Not Found`: Reservation not found

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message",
  "detail": "Additional error details (optional)"
}
```

### HTTP Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required or invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict (e.g., duplicate email)
- `500 Internal Server Error`: Server error

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production deployments.

## Pagination

List endpoints may support pagination in the future. Current implementation returns all results.

## Filtering and Sorting

Filtering and sorting capabilities may be added in future versions.

## Examples

### Complete Flow: Register, Login, and Make Reservation

```bash
# 1. Register
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# 2. Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Response: {"access_token": "eyJ...", "token_type": "bearer"}

# 3. Get Events
curl -X GET http://localhost:8000/events/events \
  -H "Authorization: Bearer eyJ..."

# 4. Make Reservation
curl -X POST http://localhost:8000/reservations/reservations/reserve \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJ..." \
  -d '{
    "event_id": 1,
    "seat_id": 5,
    "user_id": 1
  }'

# 5. Get User Reservations
curl -X GET http://localhost:8000/reservations/reservations/user/1 \
  -H "Authorization: Bearer eyJ..."
```

### JavaScript Examples

```javascript
// Register
const signupResponse = await fetch('http://localhost:8000/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

// Login
const loginResponse = await fetch('http://localhost:8000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});
const { access_token } = await loginResponse.json();

// Get Events
const eventsResponse = await fetch('http://localhost:8000/events/events', {
  headers: { 'Authorization': `Bearer ${access_token}` }
});
const events = await eventsResponse.json();

// Make Reservation
const reservationResponse = await fetch(
  'http://localhost:8000/reservations/reservations/reserve',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`
    },
    body: JSON.stringify({
      event_id: 1,
      seat_id: 5,
      user_id: 1
    })
  }
);
```

### Python Examples

```python
import requests

BASE_URL = "http://localhost:8000"

# Register
response = requests.post(
    f"{BASE_URL}/auth/signup",
    json={"email": "user@example.com", "password": "password123"}
)

# Login
response = requests.post(
    f"{BASE_URL}/auth/login",
    json={"email": "user@example.com", "password": "password123"}
)
token = response.json()["access_token"]

# Get Events
headers = {"Authorization": f"Bearer {token}"}
response = requests.get(f"{BASE_URL}/events/events", headers=headers)
events = response.json()

# Make Reservation
response = requests.post(
    f"{BASE_URL}/reservations/reservations/reserve",
    headers=headers,
    json={"event_id": 1, "seat_id": 5, "user_id": 1}
)
```

## Interactive Documentation

When services are running, you can access interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

These provide:
- Interactive API testing
- Request/response examples
- Schema definitions
- Try-it-out functionality

## WebSocket Support

WebSocket support is not currently implemented. Consider adding for real-time features like:
- Live seat availability updates
- Real-time notifications
- Live event updates

## Versioning

Current API version: **v1**

API versioning strategy:
- Version in URL path: `/api/v1/...`
- Future versions: `/api/v2/...`

## Changelog

### Version 1.0.0
- Initial API release
- Authentication endpoints
- Event management endpoints
- Reservation endpoints

## Support

For API issues or questions:
1. Check this documentation
2. Review interactive docs at `/docs`
3. Check GitHub issues
4. Contact development team

