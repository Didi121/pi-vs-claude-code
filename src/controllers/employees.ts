import { Request, Response } from 'express';
import { employeeStore, EmployeeCreateInput, EmployeeUpdateInput } from '../models/employee.js';

export const getEmployees = (req: Request, res: Response) => {
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

  res.json({
    data: paginatedEmployees,
    total: employees.length,
    page: pageNum,
    limit: limitNum,
  });
};

export const getEmployeeById = (req: Request, res: Response) => {
  const { id } = req.params;
  const employee = employeeStore.findById(id);
  if (!employee) {
    res.status(404).json({ error: 'Employee not found' });
    return;
  }
  res.json(employee);
};

export const createEmployee = (req: Request, res: Response) => {
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
  
  // Normalize data
  const normalizedData = {
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
  
  // Email uniqueness check
  const existing = employeeStore.findAll().find(emp => 
    emp.email.toLowerCase() === normalizedData.email.toLowerCase());
  if (existing) {
    res.status(409).json({ error: 'Email already exists' });
    return;
  }
  
  const newEmployee = employeeStore.create(normalizedData);
  res.status(201).json({ data: newEmployee });
};

export const updateEmployee = (req: Request, res: Response) => {
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
  
  const updated = employeeStore.update(id, data);
  if (!updated) {
    res.status(404).json({ error: 'Employee not found' });
    return;
  }
  res.json({ data: updated });
};

export const patchEmployee = (req: Request, res: Response) => {
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
  
  const updated = employeeStore.update(id, data);
  if (!updated) {
    res.status(404).json({ error: 'Employee not found' });
    return;
  }
  res.json({ data: updated });
};

export const deleteEmployee = (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = employeeStore.delete(id);
  if (!deleted) {
    res.status(404).json({ error: 'Employee not found' });
    return;
  }
  res.status(200).json({ message: 'Employee deleted' });
};

export const softDeleteEmployee = (req: Request, res: Response) => {
  const { id } = req.params;
  const softDeleted = employeeStore.softDelete(id);
  if (!softDeleted) {
    res.status(404).json({ error: 'Employee not found' });
    return;
  }
  res.status(200).json({ message: 'Employee soft-deleted (archived)' });
};