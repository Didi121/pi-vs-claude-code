# Backend API - Employee Management System

This is the backend API for the Employee Management System, built with Node.js, Express, and PostgreSQL.

## Setup Instructions

### 1. Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Docker (optional, for database)

### 2. Database Setup

#### Option A: Using Docker Compose
Run from the project root (`personnel-system/`):
```bash
docker-compose up -d
```

#### Option B: Manual PostgreSQL Setup
Create a database named `personnel_system`:
```sql
CREATE DATABASE personnel_system;
```

Apply the migration:
```bash
psql -d personnel_system -f ../../db/migrations/001_create_employees_table.sql
```

### 3. Environment Configuration
Copy the example environment file:
```bash
cp .env.example .env
```

Update the `.env` file with your database credentials.

### 4. Install Dependencies
```bash
npm install
```

### 5. Run the Server
```bash
npm run dev
```

The server will start on `http://localhost:3000`.

## API Documentation

See the API specification in `../specs/API.md`.

## Project Structure

```
src/
├── config/         # Database configuration
├── controllers/    # Request handlers
├── models/         # Sequelize models
├── routes/         # Express route definitions
└── server.js       # Application entry point
```

## Available Endpoints

- `GET /health` - Health check
- `GET /api/employees` - List employees
- `GET /api/employees/:id` - Get employee details
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Full update
- `PATCH /api/employees/:id` - Partial update
- `DELETE /api/employees/:id` - Soft delete (archive)
- `POST /api/employees/:id/restore` - Restore archived employee
- `GET /api/employees/:id/history` - Audit history

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Database Migrations
Additional migrations should be placed in `../../db/migrations/` and follow the naming convention `002_*.sql`.

## Deployment

See the DevOps documentation in the project root for deployment instructions.