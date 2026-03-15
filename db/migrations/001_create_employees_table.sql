-- Migration: Create employees table
-- Date: 2026-03-15
-- Description: Create the employees table with all required fields

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    position VARCHAR(100),
    department VARCHAR(100),
    hire_date DATE NOT NULL,
    salary DECIMAL(12, 2),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_department ON employees(department);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_employees_hire_date ON employees(hire_date);

-- Trigger to update the updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_employees_updated_at 
    BEFORE UPDATE ON employees 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE employees IS 'Employees table containing all employee information';
COMMENT ON COLUMN employees.id IS 'Unique identifier for the employee';
COMMENT ON COLUMN employees.first_name IS 'Employee first name';
COMMENT ON COLUMN employees.last_name IS 'Employee last name';
COMMENT ON COLUMN employees.email IS 'Employee email address (unique)';
COMMENT ON COLUMN employees.phone IS 'Employee phone number';
COMMENT ON COLUMN employees.position IS 'Employee job position/title';
COMMENT ON COLUMN employees.department IS 'Department where the employee works';
COMMENT ON COLUMN employees.hire_date IS 'Date when the employee was hired';
COMMENT ON COLUMN employees.salary IS 'Employee salary';
COMMENT ON COLUMN employees.status IS 'Employee status (active, inactive, terminated, etc.)';
COMMENT ON COLUMN employees.created_at IS 'Timestamp when the record was created';
COMMENT ON COLUMN employees.updated_at IS 'Timestamp when the record was last updated';