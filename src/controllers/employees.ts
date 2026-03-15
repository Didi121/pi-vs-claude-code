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
  // Basic validation
  if (!data.firstName || !data.lastName || !data.email) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  // Email uniqueness check (simplified)
  const existing = employeeStore.findAll().find(emp => emp.email === data.email);
  if (existing) {
    res.status(409).json({ error: 'Email already exists' });
    return;
  }
  const newEmployee = employeeStore.create(data);
  res.status(201).json(newEmployee);
};

export const updateEmployee = (req: Request, res: Response) => {
  const { id } = req.params;
  const data: EmployeeUpdateInput = req.body;
  const updated = employeeStore.update(id, data);
  if (!updated) {
    res.status(404).json({ error: 'Employee not found' });
    return;
  }
  res.json(updated);
};

export const patchEmployee = (req: Request, res: Response) => {
  const { id } = req.params;
  const data: EmployeeUpdateInput = req.body;
  const updated = employeeStore.update(id, data);
  if (!updated) {
    res.status(404).json({ error: 'Employee not found' });
    return;
  }
  res.json(updated);
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