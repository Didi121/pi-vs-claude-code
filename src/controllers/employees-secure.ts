import { Request, Response } from 'express';
import { employeeStore, EmployeeCreateInput, EmployeeUpdateInput } from '../models/employee.js';
import { AuthRequest } from '../middleware/auth.js';
import { PERMISSIONS } from '../config/security.js';

// Helper function to check permissions
function checkPermission(userRole: string, permission: string[]): boolean {
  return permission.includes(userRole);
}

// Sanitize employee data based on user role
function sanitizeEmployeeData(employee: any, userRole: string) {
  const baseData = {
    id: employee.id,
    firstName: employee.firstName,
    lastName: employee.lastName,
    position: employee.position,
    department: employee.department,
    status: employee.status,
  };

  // Only admins and HR can see all fields
  if (['admin', 'hr'].includes(userRole)) {
    baseData.salary = employee.salary;
    baseData.email = employee.email;
    baseData.phone = employee.phone;
    baseData.hireDate = employee.hireDate;
  }

  return baseData;
}

export const getEmployees = (req: AuthRequest, res: Response) => {
  try {
    const userRole = req.user?.role;
    
    if (!userRole) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    
    // Check if user has permission to list all employees
    if (!checkPermission(userRole, PERMISSIONS.EMPLOYEE.LIST_ALL)) {
      res.status(403).json({ error: 'Insufficient permissions to list employees' });
      return;
    }
    
    const { search, department, status, page, limit } = req.query;
    let employees = employeeStore.findAll();

    // Filtering (simplified)
    if (search) {
      const searchStr = (search as string).toLowerCase();
      employees = employees.filter(emp => 
        emp.firstName.toLowerCase().includes(searchStr) ||
        emp.lastName.toLowerCase().includes(searchStr) ||
        emp.email.toLowerCase().includes(searchStr)
      );
    }
    if (department) {
      employees = employees.filter(emp => emp.department === department);
    }
    if (status) {
      employees = employees.filter(emp => emp.status === status);
    }

    // Pagination (simplified)
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedEmployees = employees.slice(startIndex, endIndex);

    // Sanitize data based on user role
    const sanitizedEmployees = paginatedEmployees.map(emp => 
      sanitizeEmployeeData(emp, userRole)
    );

    res.json({
      data: sanitizedEmployees,
      total: employees.length,
      page: pageNum,
      limit: limitNum,
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ 
      error: 'Failed to fetch employees',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getEmployeeById = (req: AuthRequest, res: Response) => {
  try {
    const userRole = req.user?.role;
    
    if (!userRole) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { id } = req.params;
    const employee = employeeStore.findById(id);
    
    if (!employee) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }

    // Sanitize data based on user role
    const sanitizedEmployee = sanitizeEmployeeData(employee, userRole);
    
    res.json(sanitizedEmployee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ 
      error: 'Failed to fetch employee',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const createEmployee = (req: AuthRequest, res: Response) => {
  try {
    const userRole = req.user?.role;
    
    if (!userRole) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    
    // Check if user has permission to create employees
    if (!checkPermission(userRole, PERMISSIONS.EMPLOYEE.CREATE)) {
      res.status(403).json({ error: 'Insufficient permissions to create employees' });
      return;
    }
    
    const data: EmployeeCreateInput = req.body;
    
    // Comprehensive validation
    const errors: string[] = [];
    
    if (!data.firstName || !data.firstName.trim()) {
      errors.push('First name is required');
    }
    
    if (!data.lastName || !data.lastName.trim()) {
      errors.push('Last name is required');
    }
    
    if (!data.email || !data.email.trim()) {
      errors.push('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.push('Email format is invalid');
    }
    
    if (!data.position || !data.position.trim()) {
      errors.push('Position is required');
    }
    
    if (!data.department || !data.department.trim()) {
      errors.push('Department is required');
    }
    
    if (!data.hireDate) {
      errors.push('Hire date is required');
    } else {
      const hireDate = new Date(data.hireDate);
      if (isNaN(hireDate.getTime())) {
        errors.push('Hire date format is invalid');
      } else if (hireDate > new Date()) {
        errors.push('Hire date cannot be in the future');
      }
    }
    
    if (data.salary !== undefined && data.salary !== null) {
      const salaryValue = typeof data.salary === 'string' ? parseFloat(data.salary) : data.salary;
      if (isNaN(salaryValue) || salaryValue < 0) {
        errors.push('Salary must be a positive number');
      }
    }
    
    if (errors.length > 0) {
      res.status(400).json({ error: errors.join(', ') });
      return;
    }
    
    // Normalize input data
    const normalizedData: EmployeeCreateInput = {
      ...data,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone ? data.phone.trim() : '',
      position: data.position.trim(),
      department: data.department.trim(),
      hireDate: new Date(data.hireDate),
      salary: data.salary !== undefined && data.salary !== null ? 
        (typeof data.salary === 'string' ? parseFloat(data.salary) : data.salary) : 0,
      status: data.status || 'active'
    };
    
    // Email uniqueness check (case insensitive)
    const existing = employeeStore.findAll().find(emp => 
      emp.email.toLowerCase() === normalizedData.email.toLowerCase());
    if (existing) {
      res.status(409).json({ error: 'Email already exists' });
      return;
    }
    
    const newEmployee = employeeStore.create(normalizedData);
    
    res.status(201).json({
      message: 'Employee created successfully',
      data: sanitizeEmployeeData(newEmployee, userRole),
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({
      error: 'Failed to create employee',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateEmployee = (req: AuthRequest, res: Response) => {
  try {
    const userRole = req.user?.role;
    
    if (!userRole) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    
    // Check if user has permission to update employees
    if (!checkPermission(userRole, PERMISSIONS.EMPLOYEE.UPDATE)) {
      res.status(403).json({ error: 'Insufficient permissions to update employees' });
      return;
    }
    
    const { id } = req.params;
    const data: EmployeeUpdateInput = req.body;
    
    // Validate hireDate if provided
    if (data.hireDate !== undefined) {
      const hireDate = new Date(data.hireDate);
      if (isNaN(hireDate.getTime())) {
        res.status(400).json({ error: 'Hire date format is invalid' });
        return;
      } else if (hireDate > new Date()) {
        res.status(400).json({ error: 'Hire date cannot be in the future' });
        return;
      }
      // Normalize hireDate
      data.hireDate = hireDate;
    }
    
    // Validate salary if provided
    if (data.salary !== undefined && data.salary !== null) {
      const salaryValue = typeof data.salary === 'string' ? parseFloat(data.salary) : data.salary;
      if (isNaN(salaryValue) || salaryValue < 0) {
        res.status(400).json({ error: 'Salary must be a positive number' });
        return;
      }
      data.salary = salaryValue;
    }
    
    // Validate email if provided
    if (data.email) {
      if (!/\S+@\S+\.\S+/.test(data.email)) {
        res.status(400).json({ error: 'Email format is invalid' });
        return;
      }
      
      // Check email uniqueness (excluding current employee)
      const existing = employeeStore.findAll().find(emp => 
        emp.email.toLowerCase() === data.email?.toLowerCase() && emp.id !== id);
      if (existing) {
        res.status(409).json({ error: 'Email already exists' });
        return;
      }
    }
    
    // Validate status if provided
    if (data.status) {
      const validStatuses = ['active', 'inactive', 'archived'];
      if (!validStatuses.includes(data.status)) {
        res.status(400).json({ error: 'Invalid status. Must be: active, inactive, or archived' });
        return;
      }
    }
    
    const updated = employeeStore.update(id, data);
    if (!updated) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }
    
    res.json({
      message: 'Employee updated successfully',
      data: sanitizeEmployeeData(updated, userRole),
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({
      error: 'Failed to update employee',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const patchEmployee = updateEmployee; // Same as update but with partial data

export const deleteEmployee = (req: AuthRequest, res: Response) => {
  try {
    const userRole = req.user?.role;
    
    if (!userRole) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    
    // Check if user has permission to delete employees
    if (!checkPermission(userRole, PERMISSIONS.EMPLOYEE.DELETE)) {
      res.status(403).json({ error: 'Insufficient permissions to delete employees' });
      return;
    }
    
    const { id } = req.params;
    const deleted = employeeStore.delete(id);
    
    if (!deleted) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }
    
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({
      error: 'Failed to delete employee',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const softDeleteEmployee = (req: AuthRequest, res: Response) => {
  try {
    const userRole = req.user?.role;
    
    if (!userRole) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    
    // Check if user has permission to soft delete employees
    if (!checkPermission(userRole, PERMISSIONS.EMPLOYEE.SOFT_DELETE)) {
      res.status(403).json({ error: 'Insufficient permissions to archive employees' });
      return;
    }
    
    const { id } = req.params;
    const softDeleted = employeeStore.softDelete(id);
    
    if (!softDeleted) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }
    
    res.json({ message: 'Employee archived successfully' });
  } catch (error) {
    console.error('Error archiving employee:', error);
    res.status(500).json({
      error: 'Failed to archive employee',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};