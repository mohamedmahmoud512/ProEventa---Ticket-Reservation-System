# Development Guide

This guide provides information for developers working on the ProEventa ticket reservation system.

## Table of Contents

- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [API Development](#api-development)
- [Frontend Development](#frontend-development)
- [Testing](#testing)
- [Debugging](#debugging)
- [Git Workflow](#git-workflow)
- [Common Tasks](#common-tasks)

## Development Setup

### Prerequisites

- Python 3.9 or higher
- Node.js 16+ (for frontend tooling, optional)
- Docker and Docker Compose
- Git
- Code editor (VS Code recommended)

### Initial Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd "project folder"
   ```

2. **Set up Python virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install backend dependencies**:
   ```bash
   # API Gateway
   cd Ticket-reservation/app/api-gateway
   pip install -r requirements.txt

   # Auth Service
   cd ../auth-service
   pip install -r requirements.txt

   # Event Service
   cd ../event-service
   pip install -r requirements.txt

   # Reservation Service
   cd ../reservation-service
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   Create `.env` files in each service directory:
   ```env
   DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/ticket_reservation
   SECRET_KEY=your-secret-key-for-development
   ```

5. **Start database** (using Docker):
   ```bash
   docker-compose up -d db
   ```

6. **Run database migrations** (if applicable):
   ```bash
   # For each service that has migrations
   alembic upgrade head
   ```

### Running Services Locally

#### Option 1: Run All Services with Docker Compose

```bash
cd Ticket-reservation
docker-compose up --build
```

#### Option 2: Run Services Individually

**Terminal 1 - API Gateway**:
```bash
cd Ticket-reservation/app/api-gateway
uvicorn main:app --reload --port 8000
```

**Terminal 2 - Auth Service**:
```bash
cd Ticket-reservation/app/auth-service/app
uvicorn auth_service.main:app --reload --port 8001
```

**Terminal 3 - Event Service**:
```bash
cd Ticket-reservation/app/event-service/app
uvicorn event_service.main:app --reload --port 8002
```

**Terminal 4 - Reservation Service**:
```bash
cd Ticket-reservation/app/reservation-service/app
uvicorn reservation_service.main:app --reload --port 8003
```

### Frontend Development

1. **Navigate to frontend directory**:
   ```bash
   cd booking
   ```

2. **Configure API endpoint**:
   Edit `config.js`:
   ```javascript
   API_BASE_URL: 'http://localhost:8000'
   ```

3. **Start local web server** (optional):
   ```bash
   # Python
   python -m http.server 8080

   # Node.js
   npx http-server -p 8080

   # Then visit http://localhost:8080/Home.html
   ```

4. **Or open directly in browser**:
   - Simply open `Home.html` in your browser
   - Use browser developer tools for debugging

## Project Structure

### Backend Structure

```
Ticket-reservation/app/
├── api-gateway/
│   ├── main.py              # FastAPI app entry point
│   ├── routers/             # Route handlers
│   │   ├── auth.py
│   │   ├── events.py
│   │   └── reservations.py
│   ├── core/                # Core utilities
│   │   ├── dependencies.py  # Dependency injection
│   │   └── security.py      # Security utilities
│   ├── requirements.txt
│   └── Dockerfile
│
└── [service-name]/
    ├── app/[service_name]/
    │   ├── main.py          # Service entry point
    │   ├── api/v1/          # API endpoints
    │   ├── core/            # Business logic
    │   ├── db/              # Database session
    │   ├── models/          # SQLModel models
    │   └── schemas/         # Pydantic schemas
    ├── requirements.txt
    └── Dockerfile
```

### Frontend Structure

```
booking/
├── *.html                   # HTML pages
├── *.js                     # JavaScript modules
├── style.css                # Stylesheet
├── config.js                # Configuration
├── api.js                   # API service layer
├── assets/                  # Static assets
└── README-API.md            # API documentation
```

## Coding Standards

### Python (Backend)

**Style Guide**: Follow PEP 8

**Key Points**:
- Use type hints for function parameters and return types
- Use async/await for I/O operations
- Use Pydantic models for request/response validation
- Use SQLModel for database models
- Follow FastAPI best practices

**Example**:
```python
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from typing import List
from app.service.schemas import ItemCreate, ItemResponse

router = APIRouter()

@router.post("/items", response_model=ItemResponse)
async def create_item(
    item: ItemCreate,
    session: AsyncSession = Depends(get_session)
) -> ItemResponse:
    """Create a new item."""
    db_item = Item(**item.dict())
    session.add(db_item)
    await session.commit()
    return db_item
```

### JavaScript (Frontend)

**Style Guide**: Follow modern ES6+ conventions

**Key Points**:
- Use const/let instead of var
- Use async/await for API calls
- Use arrow functions where appropriate
- Keep functions small and focused
- Add comments for complex logic

**Example**:
```javascript
// Good
const fetchEvents = async () => {
    try {
        const events = await ApiService.events.getEvents();
        return events;
    } catch (error) {
        console.error('Failed to fetch events:', error);
        throw error;
    }
};

// Bad
var fetchEvents = function() {
    ApiService.events.getEvents().then(function(events) {
        return events;
    }).catch(function(error) {
        console.error(error);
    });
};
```

## API Development

### Creating a New Endpoint

1. **Define Pydantic Schema** (in `schemas/`):
   ```python
   from pydantic import BaseModel
   from datetime import datetime

   class EventCreate(BaseModel):
       name: str
       start_time: datetime
       venue_id: int

   class EventResponse(BaseModel):
       id: int
       name: str
       start_time: datetime
   ```

2. **Create Route Handler** (in `api/v1/`):
   ```python
   from fastapi import APIRouter, Depends
   from app.service.schemas import EventCreate, EventResponse

   router = APIRouter()

   @router.post("/events", response_model=EventResponse)
   async def create_event(
       event: EventCreate,
       session: AsyncSession = Depends(get_session)
   ):
       # Implementation
       pass
   ```

3. **Register Router** (in `main.py`):
   ```python
   from app.service.api.v1.events import router as events_router
   app.include_router(events_router, prefix="/api/v1")
   ```

4. **Add to API Gateway** (if needed):
   ```python
   # In api-gateway/routers/events.py
   # Route will be automatically forwarded
   ```

### Error Handling

```python
from fastapi import HTTPException

@router.get("/items/{item_id}")
async def get_item(item_id: int):
    item = await get_item_from_db(item_id)
    if not item:
        raise HTTPException(
            status_code=404,
            detail="Item not found"
        )
    return item
```

### Authentication

```python
from app.api_gateway.core.dependencies import get_current_user

@router.get("/protected")
async def protected_route(
    user_id: str = Depends(get_current_user)
):
    # user_id is available here
    return {"user_id": user_id}
```

## Frontend Development

### Adding a New Page

1. **Create HTML file**:
   ```html
   <!doctype html>
   <html>
   <head>
       <title>New Page - ProEventa</title>
       <link rel="stylesheet" href="style.css">
   </head>
   <body>
       <!-- Content -->
       <script src="config.js"></script>
       <script src="api.js"></script>
       <script src="new-page.js"></script>
   </body>
   </html>
   ```

2. **Create JavaScript file**:
   ```javascript
   // new-page.js
   document.addEventListener('DOMContentLoaded', () => {
       initializePage();
   });

   async function initializePage() {
       try {
           const data = await ApiService.events.getEvents();
           renderData(data);
       } catch (error) {
           console.error('Error:', error);
       }
   }
   ```

### Using the API Service

```javascript
// Authentication
const login = async (email, password) => {
    try {
        const response = await ApiService.auth.login({ email, password });
        // Handle success
    } catch (error) {
        // Handle error
    }
};

// Events
const events = await ApiService.events.getEvents();
const event = await ApiService.events.getEventById(eventId);

// Reservations
const reservation = await ApiService.reservations.makeReservation({
    event_id: 1,
    seat_id: 1,
    user_id: 1
});
```

## Testing

### Backend Testing

**Unit Tests**:
```python
import pytest
from fastapi.testclient import TestClient
from app.service.main import app

client = TestClient(app)

def test_create_item():
    response = client.post("/api/v1/items", json={
        "name": "Test Item",
        "description": "Test Description"
    })
    assert response.status_code == 201
    assert response.json()["name"] == "Test Item"
```

**Run Tests**:
```bash
pytest
pytest tests/test_items.py
pytest -v  # Verbose output
```

### Frontend Testing

**Manual Testing**:
- Open browser developer tools
- Test API calls in console
- Check network tab for requests
- Verify UI behavior

**Example Console Test**:
```javascript
// Test authentication
ApiService.auth.login({
    email: 'test@example.com',
    password: 'password'
}).then(console.log).catch(console.error);
```

## Debugging

### Backend Debugging

**Print Debugging**:
```python
import logging
logging.basicConfig(level=logging.DEBUG)

logger = logging.getLogger(__name__)
logger.debug("Debug message")
```

**Using Debugger**:
- VS Code: Set breakpoints and use debugger
- PyCharm: Built-in debugger
- pdb: Python debugger
  ```python
  import pdb; pdb.set_trace()
  ```

**Check Logs**:
```bash
# Docker
docker-compose logs -f api-gateway

# Local
# Logs appear in console when running uvicorn
```

### Frontend Debugging

**Browser Developer Tools**:
- Console: Check for errors and log messages
- Network: Monitor API requests and responses
- Sources: Set breakpoints in JavaScript
- Application: Check localStorage, sessionStorage

**Common Issues**:
- CORS errors: Check API Gateway CORS configuration
- 401 errors: Verify token is being sent
- 404 errors: Check API endpoint URLs
- Network errors: Verify API Gateway is running

## Git Workflow

### Branch Strategy

- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: Feature branches
- `bugfix/*`: Bug fix branches

### Commit Messages

Follow conventional commits:
```
feat: Add user profile page
fix: Resolve authentication token issue
docs: Update API documentation
refactor: Improve error handling
test: Add unit tests for reservation service
```

### Pull Request Process

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Commit changes
5. Push to remote
6. Create pull request
7. Code review
8. Merge to develop/main

## Common Tasks

### Adding a New Service

1. **Create service directory**:
   ```bash
   mkdir -p Ticket-reservation/app/new-service/app/new_service
   ```

2. **Create main.py**:
   ```python
   from fastapi import FastAPI
   app = FastAPI()
   ```

3. **Add to docker-compose.yml**:
   ```yaml
   new-service:
     build: ./app/new-service
     ports:
       - "8004:8000"
     environment:
       - DATABASE_URL=postgresql+asyncpg://user:password@db:5432/new_db
   ```

4. **Add router to API Gateway**:
   ```python
   # In api-gateway/routers/new_service.py
   # Create router and forward requests
   ```

### Updating Dependencies

1. **Update requirements.txt**:
   ```bash
   pip freeze > requirements.txt
   ```

2. **Rebuild Docker images**:
   ```bash
   docker-compose build
   ```

### Database Migrations

1. **Create migration**:
   ```bash
   alembic revision --autogenerate -m "Add new table"
   ```

2. **Review migration file**:
   ```bash
   # Check generated migration in alembic/versions/
   ```

3. **Apply migration**:
   ```bash
   alembic upgrade head
   ```

### Code Formatting

**Python**:
```bash
# Install black
pip install black

# Format code
black .

# Check formatting
black --check .
```

**JavaScript**:
```bash
# Install prettier
npm install -g prettier

# Format code
prettier --write "*.js"
```

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLModel Documentation](https://sqlmodel.tiangolo.com/)
- [Pydantic Documentation](https://docs.pydantic.dev/)
- [Docker Documentation](https://docs.docker.com/)

## Getting Help

- Check existing documentation
- Review code comments
- Ask team members
- Create GitHub issue for bugs
- Check FastAPI community resources

