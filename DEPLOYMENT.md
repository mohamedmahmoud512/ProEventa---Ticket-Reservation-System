# Deployment Guide

This guide covers deployment strategies and procedures for the ProEventa ticket reservation system.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Docker Deployment](#docker-deployment)
- [Production Deployment](#production-deployment)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Frontend Deployment](#frontend-deployment)
- [Monitoring and Maintenance](#monitoring-and-maintenance)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- Docker Engine 20.10+
- Docker Compose 2.0+
- Git (for cloning repository)

### System Requirements

**Minimum**:
- CPU: 2 cores
- RAM: 4GB
- Disk: 20GB free space

**Recommended (Production)**:
- CPU: 4+ cores
- RAM: 8GB+
- Disk: 50GB+ SSD
- Network: Stable internet connection

## Docker Deployment

### Quick Start

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd "project folder/Ticket-reservation"
   ```

2. **Review and update docker-compose.yml**:
   - Update database credentials
   - Set SECRET_KEY for API Gateway
   - Adjust port mappings if needed

3. **Start all services**:
   ```bash
   docker-compose up -d --build
   ```

4. **Verify services are running**:
   ```bash
   docker-compose ps
   ```

5. **Check logs**:
   ```bash
   docker-compose logs -f
   ```

### Service Ports

- **API Gateway**: 8000
- **Auth Service**: 8001
- **Event Service**: 8002
- **Reservation Service**: 8003
- **PostgreSQL**: 5432

### Stopping Services

```bash
docker-compose down
```

To remove volumes (data will be lost):
```bash
docker-compose down -v
```

## Production Deployment

### Production Considerations

1. **Security**
   - Use strong, unique passwords
   - Enable HTTPS/TLS
   - Configure firewall rules
   - Use secrets management
   - Regular security updates

2. **Performance**
   - Enable connection pooling
   - Configure caching (Redis recommended)
   - Use load balancer
   - Optimize database queries

3. **Reliability**
   - Set up health checks
   - Configure auto-restart policies
   - Implement backup strategy
   - Monitor service health

### Production Docker Compose

Create a `docker-compose.prod.yml` file:

```yaml
version: '3.8'

services:
  api-gateway:
    build: ./app/api-gateway
    restart: always
    environment:
      - SECRET_KEY=${SECRET_KEY}
      - NODE_ENV=production
    ports:
      - "80:8000"
      - "443:8000"
    depends_on:
      - auth-service
      - event-service
      - reservation-service

  # ... other services with restart: always

  db:
    image: postgres:13
    restart: always
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    command: postgres -c max_connections=200

volumes:
  postgres_data:
```

### Environment Variables

Create a `.env` file for production:

```env
# Database
DB_USER=your_db_user
DB_PASSWORD=your_secure_password
DB_NAME=ticket_reservation

# API Gateway
SECRET_KEY=your_very_secure_secret_key_here

# Service URLs (if different from defaults)
AUTH_SERVICE_URL=http://auth-service:8000
EVENT_SERVICE_URL=http://event-service:8000
RESERVATION_SERVICE_URL=http://reservation-service:8000
```

**Important**: Never commit `.env` files to version control!

### Running Production Build

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Environment Configuration

### API Gateway Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `SECRET_KEY` | JWT secret key | - | Yes |
| `AUTH_SERVICE_URL` | Auth service URL | `http://auth-service:8000` | No |
| `EVENT_SERVICE_URL` | Event service URL | `http://event-service:8000` | No |
| `RESERVATION_SERVICE_URL` | Reservation service URL | `http://reservation-service:8000` | No |

### Service Environment Variables

Each service requires:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql+asyncpg://user:pass@db:5432/dbname` |

### Frontend Configuration

Update `booking/config.js`:

```javascript
const config = {
    API_BASE_URL: process.env.API_BASE_URL || 'https://api.yourdomain.com',
    // ... other config
};
```

## Database Setup

### Initial Setup

The database is automatically created when services start. However, you may need to:

1. **Run migrations** (if applicable):
   ```bash
   docker-compose exec auth-service python -m alembic upgrade head
   ```

2. **Create initial admin user** (if needed):
   ```bash
   docker-compose exec auth-service python scripts/create_admin.py
   ```

### Database Backups

**Manual Backup**:
```bash
docker-compose exec db pg_dump -U user ticket_reservation > backup_$(date +%Y%m%d).sql
```

**Restore Backup**:
```bash
docker-compose exec -T db psql -U user ticket_reservation < backup_20240101.sql
```

**Automated Backups** (cron job):
```bash
# Add to crontab
0 2 * * * cd /path/to/project && docker-compose exec -T db pg_dump -U user ticket_reservation > /backups/backup_$(date +\%Y\%m\%d).sql
```

### Database Maintenance

**Connect to Database**:
```bash
docker-compose exec db psql -U user ticket_reservation
```

**Check Database Size**:
```sql
SELECT pg_size_pretty(pg_database_size('ticket_reservation'));
```

**Vacuum Database**:
```sql
VACUUM ANALYZE;
```

## Frontend Deployment

### Static Hosting Options

#### Option 1: Simple Web Server

1. **Copy files to web server**:
   ```bash
   scp -r booking/* user@server:/var/www/proeventa/
   ```

2. **Configure web server** (Nginx example):
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       root /var/www/proeventa;
       index Home.html;

       location / {
           try_files $uri $uri/ =404;
       }
   }
   ```

#### Option 2: CDN/Static Hosting

Deploy to services like:
- **Netlify**: Drag and drop `booking/` folder
- **Vercel**: Connect repository and set build directory
- **AWS S3 + CloudFront**: Upload to S3 bucket
- **GitHub Pages**: Push to `gh-pages` branch

### Build Optimization

1. **Minify JavaScript**:
   ```bash
   npm install -g terser
   terser api.js -o api.min.js
   ```

2. **Minify CSS**:
   ```bash
   npm install -g cssnano
   cssnano style.css style.min.css
   ```

3. **Optimize Images**:
   - Use WebP format where possible
   - Compress images
   - Use appropriate image sizes

### CORS Configuration

If frontend and backend are on different domains, configure CORS in API Gateway:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Monitoring and Maintenance

### Health Checks

**Check API Gateway**:
```bash
curl http://localhost:8000/health
```

**Check Individual Services**:
```bash
curl http://localhost:8001/health  # Auth Service
curl http://localhost:8002/health  # Event Service
curl http://localhost:8003/health  # Reservation Service
```

### Log Monitoring

**View all logs**:
```bash
docker-compose logs -f
```

**View specific service logs**:
```bash
docker-compose logs -f api-gateway
docker-compose logs -f auth-service
```

**Log rotation**: Configure Docker logging driver for production

### Resource Monitoring

**Check container resources**:
```bash
docker stats
```

**Check disk usage**:
```bash
docker system df
```

### Updates and Upgrades

1. **Pull latest code**:
   ```bash
   git pull
   ```

2. **Rebuild services**:
   ```bash
   docker-compose build
   ```

3. **Restart services** (zero-downtime):
   ```bash
   docker-compose up -d --no-deps --build api-gateway
   ```

4. **Rollback** (if needed):
   ```bash
   git checkout <previous-commit>
   docker-compose up -d --build
   ```

## Troubleshooting

### Common Issues

#### Services Won't Start

1. **Check port availability**:
   ```bash
   netstat -tulpn | grep :8000
   ```

2. **Check Docker logs**:
   ```bash
   docker-compose logs [service-name]
   ```

3. **Verify environment variables**:
   ```bash
   docker-compose config
   ```

#### Database Connection Errors

1. **Check database is running**:
   ```bash
   docker-compose ps db
   ```

2. **Verify connection string**:
   ```bash
   docker-compose exec auth-service env | grep DATABASE_URL
   ```

3. **Test database connection**:
   ```bash
   docker-compose exec db psql -U user -d ticket_reservation -c "SELECT 1;"
   ```

#### Authentication Issues

1. **Verify SECRET_KEY is set**:
   ```bash
   docker-compose exec api-gateway env | grep SECRET_KEY
   ```

2. **Check token generation**:
   - Test login endpoint
   - Verify JWT token format

#### Frontend Can't Connect to API

1. **Check API Gateway is accessible**:
   ```bash
   curl http://localhost:8000/health
   ```

2. **Verify CORS configuration**
3. **Check browser console for errors**
4. **Verify API_BASE_URL in config.js**

### Debugging

**Enable debug logging**:
```yaml
# docker-compose.yml
services:
  api-gateway:
    environment:
      - LOG_LEVEL=DEBUG
```

**Access service shell**:
```bash
docker-compose exec api-gateway /bin/bash
```

**Inspect container**:
```bash
docker inspect <container-id>
```

### Performance Issues

1. **Check database performance**:
   ```sql
   SELECT * FROM pg_stat_activity;
   ```

2. **Monitor slow queries**:
   - Enable PostgreSQL slow query log
   - Use EXPLAIN ANALYZE

3. **Check service response times**:
   - Use API Gateway logs
   - Monitor with tools like Prometheus

## Security Checklist

- [ ] Strong passwords for all services
- [ ] HTTPS/TLS enabled
- [ ] Firewall configured
- [ ] Secrets stored securely (not in code)
- [ ] Regular security updates
- [ ] Database backups configured
- [ ] Access logs enabled
- [ ] Rate limiting configured
- [ ] Input validation enabled
- [ ] SQL injection prevention verified

## Backup and Recovery

### Backup Strategy

1. **Database backups**: Daily automated backups
2. **Configuration backups**: Version control
3. **Application backups**: Docker images

### Recovery Procedure

1. **Stop services**:
   ```bash
   docker-compose down
   ```

2. **Restore database**:
   ```bash
   docker-compose exec -T db psql -U user ticket_reservation < backup.sql
   ```

3. **Restart services**:
   ```bash
   docker-compose up -d
   ```

4. **Verify functionality**:
   - Test API endpoints
   - Verify data integrity

## Support

For deployment issues:
1. Check logs first
2. Review this documentation
3. Check GitHub issues
4. Contact development team

