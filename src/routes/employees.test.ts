import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app.js';
import { employeeStore } from '../models/employee.js';

// Generate a valid JWT token for testing (admin role)
const generateTestToken = () => {
  const payload = {
    userId: 'test-user-id',
    username: 'testadmin',
    role: 'admin' as const,
  };
  const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  return jwt.sign(payload, secret, { expiresIn: '1h' });
};

describe('Employees API', () => {
  let testToken: string;

  let agent: any;

  beforeEach(() => {
    // Clear the store before each test
    employeeStore.clear();
    testToken = generateTestToken();
    agent = request.agent(app);
    agent.set('Authorization', `Bearer ${testToken}`);
  });

  describe('GET /api/employees', () => {
    it('should return empty list when no employees', async () => {
      const response = await agent.get('/api/employees');
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.total).toBe(0);
    });

    it('should return list of employees', async () => {
      employeeStore.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        position: 'Developer',
        department: 'IT',
        hireDate: new Date('2023-01-01'),
        salary: 60000,
        status: 'active',
      });

      const response = await agent.get('/api/employees');
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].firstName).toBe('John');
    });

    it('should support search query', async () => {
      employeeStore.create({
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@example.com',
        phone: '1234567890',
        position: 'Manager',
        department: 'HR',
        hireDate: new Date(),
        salary: 80000,
        status: 'active',
      });
      employeeStore.create({
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob@example.com',
        phone: '1234567890',
        position: 'Designer',
        department: 'Design',
        hireDate: new Date(),
        salary: 70000,
        status: 'active',
      });

      const response = await agent.get('/api/employees?search=Alice');
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].firstName).toBe('Alice');
    });

    it('should support pagination', async () => {
      for (let i = 0; i < 15; i++) {
        employeeStore.create({
          firstName: `User${i}`,
          lastName: `Last${i}`,
          email: `user${i}@example.com`,
          phone: '1234567890',
          position: 'Worker',
          department: 'Dept',
          hireDate: new Date(),
          salary: 50000,
          status: 'active',
        });
      }

      const response = await agent.get('/api/employees?page=2&limit=5');
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(5);
      expect(response.body.page).toBe(2);
      expect(response.body.limit).toBe(5);
      expect(response.body.total).toBe(15);
    });
  });

  describe('GET /api/employees/:id', () => {
    it('should return employee by id', async () => {
      const employee = employeeStore.create({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        phone: '1234567890',
        position: 'Engineer',
        department: 'Engineering',
        hireDate: new Date(),
        salary: 75000,
        status: 'active',
      });

      const response = await agent.get(`/api/employees/${employee.id}`);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(employee.id);
      expect(response.body.firstName).toBe('Jane');
    });

    it('should return 404 if employee not found', async () => {
      const response = await agent.get('/api/employees/non-existent-id');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Employee not found');
    });
  });

  describe('POST /api/employees', () => {
    it('should create a new employee', async () => {
      const newEmployee = {
        firstName: 'New',
        lastName: 'Employee',
        email: 'new@example.com',
        phone: '1234567890',
        position: 'Analyst',
        department: 'Finance',
        hireDate: '2024-01-01',
        salary: 55000,
        status: 'active',
      };

      const response = await agent
        .post('/api/employees')
        .send(newEmployee);
      console.log('Response:', response.status, response.body);
      
      expect(response.status).toBe(201);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.firstName).toBe('New');
      expect(response.body.data.email).toBe('new@example.com');
    });

    it('should return 400 if required fields missing', async () => {
      const invalidEmployee = {
        lastName: 'MissingFirstName',
        email: 'missing@example.com',
      };

      const response = await agent
        .post('/api/employees')
        .send(invalidEmployee);
      
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('First name is required');
      expect(response.body.error).toContain('Position is required');
      expect(response.body.error).toContain('Department is required');
    });

    it('should return 409 if email already exists', async () => {
      employeeStore.create({
        firstName: 'Existing',
        lastName: 'User',
        email: 'duplicate@example.com',
        phone: '1234567890',
        position: 'Staff',
        department: 'HR',
        hireDate: new Date(),
        salary: 40000,
        status: 'active',
      });

      const duplicateEmployee = {
        firstName: 'Another',
        lastName: 'Person',
        email: 'duplicate@example.com',
        phone: '1234567890',
        position: 'Other',
        department: 'IT',
        hireDate: '2024-02-02',
        salary: 50000,
        status: 'active',
      };

      const response = await agent
        .post('/api/employees')
        .send(duplicateEmployee);
      
      expect(response.status).toBe(409);
      expect(response.body.error).toBe('Email already exists');
    });
  });

  describe('PUT /api/employees/:id', () => {
    it('should update an existing employee', async () => {
      const employee = employeeStore.create({
        firstName: 'Original',
        lastName: 'Name',
        email: 'original@example.com',
        phone: '1234567890',
        position: 'Old',
        department: 'Dept',
        hireDate: new Date(),
        salary: 10000,
        status: 'active',
      });

      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
        email: 'updated@example.com',
        phone: '1234567890',
        position: 'New',
        department: 'NewDept',
        hireDate: '2024-03-01',
        salary: 20000,
        status: 'inactive',
      };

      const response = await agent
        .put(`/api/employees/${employee.id}`)
        .send(updateData);
      
      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(employee.id);
      expect(response.body.data.firstName).toBe('Updated');
      expect(response.body.data.email).toBe('updated@example.com');
      expect(response.body.data.salary).toBe(20000);
    });

    it('should return 404 if employee not found', async () => {
      const response = await agent
        .put('/api/employees/non-existent-id')
        .send({ firstName: 'Any' });
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Employee not found');
    });
  });

  describe('PATCH /api/employees/:id', () => {
    it('should partially update an employee', async () => {
      const employee = employeeStore.create({
        firstName: 'Partial',
        lastName: 'Update',
        email: 'partial@example.com',
        phone: '1234567890',
        position: 'Old',
        department: 'Dept',
        hireDate: new Date(),
        salary: 30000,
        status: 'active',
      });

      const patchData = {
        firstName: 'Patched',
        salary: 35000,
      };

      const response = await agent
        .patch(`/api/employees/${employee.id}`)
        .send(patchData);
      
      expect(response.status).toBe(200);
      expect(response.body.data.firstName).toBe('Patched');
      expect(response.body.data.lastName).toBe('Update'); // unchanged
      expect(response.body.data.salary).toBe(35000);
    });

    it('should return 404 if employee not found', async () => {
      const response = await agent
        .patch('/api/employees/non-existent-id')
        .send({ firstName: 'Any' });
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Employee not found');
    });
  });

  describe('DELETE /api/employees/:id', () => {
    it('should delete an employee', async () => {
      const employee = employeeStore.create({
        firstName: 'ToDelete',
        lastName: 'User',
        email: 'delete@example.com',
        phone: '1234567890',
        position: 'Temp',
        department: 'Temp',
        hireDate: new Date(),
        salary: 10000,
        status: 'active',
      });

      const response = await agent
        .delete(`/api/employees/${employee.id}`);
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Employee deleted successfully');
      expect(employeeStore.findById(employee.id)).toBeUndefined();
    });

    it('should return 404 if employee not found', async () => {
      const response = await agent
        .delete('/api/employees/non-existent-id');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Employee not found');
    });
  });

  describe('POST /api/employees/:id/archive', () => {
    it('should soft delete (archive) an employee', async () => {
      const employee = employeeStore.create({
        firstName: 'ToArchive',
        lastName: 'User',
        email: 'archive@example.com',
        phone: '1234567890',
        position: 'Staff',
        department: 'HR',
        hireDate: new Date(),
        salary: 50000,
        status: 'active',
      });

      const response = await agent
        .post(`/api/employees/${employee.id}/archive`);
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Employee archived successfully');
      const archived = employeeStore.findById(employee.id);
      expect(archived?.status).toBe('archived');
    });

    it('should return 404 if employee not found', async () => {
      const response = await agent
        .post('/api/employees/non-existent-id/archive');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Employee not found');
    });
  });
});