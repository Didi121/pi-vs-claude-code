# Database Schema

This directory contains the database schema definitions and migrations for the employee management system.

## Table Structure

### Employees Table

The `employees` table stores all employee information with the following fields:

| Column Name   | Type                    | Constraints          | Description                     |
|---------------|-------------------------|----------------------|---------------------------------|
| id            | SERIAL                  | PRIMARY KEY          | Unique identifier               |
| first_name    | VARCHAR(100)            | NOT NULL             | Employee first name             |
| last_name     | VARCHAR(100)            | NOT NULL             | Employee last name              |
| email         | VARCHAR(255)            | UNIQUE, NOT NULL     | Employee email address          |
| phone         | VARCHAR(20)             |                      | Employee phone number           |
| position      | VARCHAR(100)            |                      | Employee job position/title     |
| department    | VARCHAR(100)            |                      | Department name                 |
| hire_date     | DATE                    | NOT NULL             | Date when employee was hired    |
| salary        | DECIMAL(12, 2)          |                      | Employee salary                 |
| status        | VARCHAR(50)             | DEFAULT 'active'     | Employee status                 |
| created_at    | TIMESTAMP WITH TIME ZONE| DEFAULT CURRENT_TIME | Record creation timestamp       |
| updated_at    | TIMESTAMP WITH TIME ZONE| DEFAULT CURRENT_TIME | Record last update timestamp    |

## Migrations

All database schema changes are managed through migration files in the `migrations/` directory. These files should be applied in numerical order.

### Current Migrations

1. `001_create_employees_table.sql` - Creates the initial employees table with all required fields and indexes.

## Indexes

The following indexes have been created for performance optimization:

- `idx_employees_email` - For fast email lookups
- `idx_employees_department` - For filtering by department
- `idx_employees_status` - For filtering by status
- `idx_employees_hire_date` - For date range queries

## Triggers

An automatic trigger updates the `updated_at` timestamp whenever a record is modified.

## Notes

This schema follows standard relational database design principles:
- Primary keys for unique identification
- Proper data types for each field
- Indexes for commonly queried columns
- Timestamps for audit trails
- Constraints for data integrity