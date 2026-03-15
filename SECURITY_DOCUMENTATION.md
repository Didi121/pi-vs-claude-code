# Authentication & Authorization System Documentation

## Overview

This document describes the security system implemented for the Personnel Management API, including authentication, authorization, security headers, and role-based access control (RBAC).

## Features Implemented

### 🔐 Authentication
- **JWT-based authentication** with access and refresh tokens
- **Secure password hashing** using bcryptjs
- **Token expiration** (24h for access tokens, 7d for refresh tokens)
- **User session management** with role-based permissions

### 🛡️ Authorization (RBAC)
- **Role-based access control** with 4 user roles:
  - `admin`: Full system access
  - `hr`: Human resources management
  - `manager`: Department management
  - `employee`: Limited access
- **Granular permissions** for different operations
- **Data sanitization** based on user role

### 🔒 Security Headers
- **CSP (Content Security Policy)** protection
- **XSS protection** headers
- **Clickjacking protection** (X-Frame-Options: DENY)
- **Content type sniffing protection**
- **HSTS (HTTP Strict Transport Security)**
- **Server header removal** for security by obscurity

### 🚦 Input Validation
- **Data sanitization** to prevent XSS attacks
- **Email format validation**
- **Phone number validation**
- **Salary validation** (positive numbers only)
- **Status validation** (active, inactive, archived)

### 📊 Rate Limiting
- **Request throttling** (100 requests per 15 minutes)
- **IP-based tracking**
- **Configurable limits**

## API Endpoints

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user in the system.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password123",
  "role": "employee"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "employee",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST `/api/auth/login`
Authenticate user and receive access tokens.

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "secure_password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "employee",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### GET `/api/auth/profile`
Get current authenticated user's profile.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "employee",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Employee Management Endpoints (Protected)

All employee endpoints require authentication via Bearer token in the Authorization header.

#### GET `/api/employees`
List all employees with optional filtering and pagination.

**Query Parameters:**
- `search` - Search in firstName, lastName, email
- `department` - Filter by department
- `status` - Filter by status (active, inactive, archived)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com", // Only visible to admin/HR
      "position": "Software Engineer",
      "department": "IT",
      "status": "active",
      "salary": 75000, // Only visible to admin/HR
      "phone": "+1234567890", // Only visible to admin/HR
      "hireDate": "2023-01-15T00:00:00.000Z" // Only visible to admin/HR
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

#### POST `/api/employees`
Create a new employee.

**Permissions:** Admin, HR

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "phone": "+1234567890",
  "position": "Marketing Manager",
  "department": "Marketing",
  "hireDate": "2023-06-01",
  "salary": 65000,
  "status": "active"
}
```

#### PUT `/api/employees/:id`
Update employee information.

**Permissions:** Admin, HR, Manager

#### DELETE `/api/employees/:id`
Hard delete employee from system.

**Permissions:** Admin, HR

#### POST `/api/employees/:id/archive`
Soft delete (archive) employee.

**Permissions:** Admin, HR

### Health Check Endpoint

#### GET `/health`
Public health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Role-Based Data Visibility

### Admin & HR Roles
- Full access to all employee data
- Can view sensitive information (salary, phone, email, hire date)
- Can perform all CRUD operations

### Manager Role
- Full access to employee data in their department
- Can view position, department, and basic info
- Can update employee information
- Cannot view salary or personal contact details

### Employee Role
- Limited access to basic employee information
- Can only view: firstName, lastName, position, department, status
- Cannot view salary, phone, email, or hire date
- Read-only access

## Error Handling

### Authentication Errors
- `401 Unauthorized` - Invalid or missing authentication token
- `401 Unauthorized` - Invalid credentials during login
- `409 Conflict` - Username or email already exists during registration

### Authorization Errors
- `403 Forbidden` - Insufficient permissions for requested operation
- `404 Not Found` - Resource not found
- `400 Bad Request` - Invalid input data
- `429 Too Many Requests` - Rate limit exceeded

### Security Best Practices Implemented

1. **Input Validation**: All user inputs are validated and sanitized
2. **SQL Injection Prevention**: Using parameterized queries (when database is implemented)
3. **XSS Prevention**: Input sanitization and Content Security Policy headers
4. **Rate Limiting**: Protection against brute force attacks
5. **HTTPS Ready**: HSTS headers configured for production deployment
6. **Secrets Management**: JWT secrets stored in environment variables
7. **Error Information Leakage Prevention**: Detailed errors only in development mode

## Environment Configuration

### Required Environment Variables

```bash
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-environment
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3000
NODE_ENV=development

# Optional: CORS Configuration
FRONTEND_URL=http://localhost:3000
```

## Default Users

The system creates default users for testing:

1. **Admin User**
   - Username: `admin`
   - Email: `admin@company.com`
   - Password: `admin123`
   - Role: `admin`

2. **HR Manager**
   - Username: `hr_manager`
   - Email: `hr@company.com`
   - Password: `hr123456`
   - Role: `hr`

⚠️ **IMPORTANT**: Change these passwords immediately in production!

## Testing

The system includes comprehensive test coverage for:
- User registration and authentication
- Token generation and validation
- Role-based authorization
- Input validation and security
- Rate limiting
- Security headers

Run tests with:
```bash
bun test
```

## Security Considerations for Production

1. **Change Default Secrets**: Immediately change `JWT_SECRET` and default passwords
2. **Use HTTPS**: Deploy with SSL/TLS certificates
3. **Database Security**: Use proper database connection strings with authentication
4. **Rate Limiting**: Adjust rate limits based on your needs
5. **Input Validation**: Extend validation for your specific business rules
6. **Logging**: Implement comprehensive security logging
7. **Monitoring**: Set up alerts for suspicious activities
8. **Regular Updates**: Keep dependencies updated for security patches

## Next Steps

The security system is now fully implemented with:
- ✅ JWT-based authentication
- ✅ Role-based authorization (RBAC)
- ✅ Security headers and CORS
- ✅ Input validation and sanitization
- ✅ Rate limiting
- ✅ Password hashing
- ✅ Token refresh mechanism
- ✅ Comprehensive error handling
- ✅ Role-based data visibility

Ready for integration with the main personnel management system!