# API Specification - Employee Management System

This document defines the REST API endpoints for the Employee Management System.

## Base URL
```
http://localhost:3000/api
```

## Data Model

### Employee Object
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | integer | Unique identifier | Read-only |
| firstName | string | Employee first name | Required |
| lastName | string | Employee last name | Required |
| email | string | Employee email address | Required, Unique |
| phone | string | Phone number | Optional |
| position | string | Job position/title | Optional |
| department | string | Department name | Optional |
| hireDate | string (ISO 8601 date) | Date of hire | Required |
| salary | number | Annual salary | Optional |
| status | string | Employee status | Default: "active" |
| createdAt | string (ISO 8601 datetime) | Creation timestamp | Read-only |
| updatedAt | string (ISO 8601 datetime) | Last update timestamp | Read-only |

**Note:** Field names in JSON use camelCase (e.g., `firstName`), while database columns use snake_case (e.g., `first_name`).

## Endpoints

### 1. List Employees `GET /api/employees`

Returns a paginated list of employees.

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 20) - Items per page (max 100)
- `search` (optional) - Search term for firstName, lastName, email
- `department` (optional) - Filter by department
- `status` (optional) - Filter by status

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "position": "Software Engineer",
      "department": "Engineering",
      "hireDate": "2023-01-15",
      "salary": 75000,
      "status": "active",
      "createdAt": "2023-01-15T09:00:00Z",
      "updatedAt": "2023-05-20T14:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### 2. Create Employee `POST /api/employees`

Creates a new employee.

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "phone": "+9876543210",
  "position": "Product Manager",
  "department": "Product",
  "hireDate": "2024-03-15",
  "salary": 85000,
  "status": "active"
}
```

**Validation Rules:**
- `firstName`, `lastName`, `email`, `hireDate` required
- `email` must be unique across employees
- `salary` must be positive number if provided
- `hireDate` must not be in the future

**Response (201 Created):**
```json
{
  "data": {
    "id": 2,
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "phone": "+9876543210",
    "position": "Product Manager",
    "department": "Product",
    "hireDate": "2024-03-15",
    "salary": 85000,
    "status": "active",
    "createdAt": "2026-03-15T09:45:00Z",
    "updatedAt": "2026-03-15T09:45:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Validation errors
- `409 Conflict` - Email already exists

### 3. Get Employee `GET /api/employees/{id}`

Retrieves a single employee by ID.

**Path Parameters:**
- `id` (required) - Employee ID

**Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "position": "Software Engineer",
    "department": "Engineering",
    "hireDate": "2023-01-15",
    "salary": 75000,
    "status": "active",
    "createdAt": "2023-01-15T09:00:00Z",
    "updatedAt": "2023-05-20T14:30:00Z"
  }
}
```

**Error Responses:**
- `404 Not Found` - Employee not found

### 4. Update Employee `PUT /api/employees/{id}`

Full update of an employee (replaces all fields).

**Path Parameters:**
- `id` (required) - Employee ID

**Request Body:** Same as Create Employee, but all fields required (except read-only fields).

**Response (200 OK):** Updated employee object.

**Error Responses:**
- `400 Bad Request` - Validation errors
- `404 Not Found` - Employee not found
- `409 Conflict` - Email conflict with another employee

### 5. Partial Update Employee `PATCH /api/employees/{id}`

Partial update (only specified fields).

**Path Parameters:**
- `id` (required) - Employee ID

**Request Body:** Any subset of employee fields.

**Response (200 OK):** Updated employee object.

**Error Responses:** Same as PUT.

### 6. Delete Employee `DELETE /api/employees/{id}`

Soft delete (archives) an employee.

**Path Parameters:**
- `id` (required) - Employee ID

**Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "status": "archived",
    "updatedAt": "2026-03-15T09:50:00Z"
  },
  "message": "Employee archived successfully"
}
```

**Error Responses:**
- `404 Not Found` - Employee not found

### 7. Restore Employee `POST /api/employees/{id}/restore`

Restores a previously archived employee.

**Path Parameters:**
- `id` (required) - Employee ID

**Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "status": "active",
    "updatedAt": "2026-03-15T09:55:00Z"
  },
  "message": "Employee restored successfully"
}
```

**Error Responses:**
- `404 Not Found` - Employee not found
- `400 Bad Request` - Employee not archived

### 8. Employee History `GET /api/employees/{id}/history`

Retrieves audit history for an employee.

**Path Parameters:**
- `id` (required) - Employee ID

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 123,
      "employeeId": 1,
      "changedBy": "system",
      "changeType": "create",
      "before": null,
      "after": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com"
      },
      "changedAt": "2023-01-15T09:00:00Z"
    },
    {
      "id": 124,
      "employeeId": 1,
      "changedBy": "admin",
      "changeType": "update",
      "before": {
        "position": "Junior Engineer"
      },
      "after": {
        "position": "Software Engineer"
      },
      "changedAt": "2023-05-20T14:30:00Z"
    }
  ]
}
```

## Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Unique constraint violation |
| 500 | Internal Server Error |

## Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email must be unique"
      }
    ]
  }
}
```

## OpenAPI Specification

Full OpenAPI 3.0 specification is available in `openapi.yaml` (to be generated).

## Implementation Notes

- Use PostgreSQL database with schema defined in `db/migrations/001_create_employees_table.sql`
- Implement proper input validation for all endpoints
- Ensure email uniqueness constraint is enforced
- Soft delete implementation: set `status = 'archived'` instead of physical deletion
- All timestamps should be in ISO 8601 format with timezone (UTC)

---

*This document should be kept in sync with the actual API implementation.*