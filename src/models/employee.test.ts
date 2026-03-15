import { describe, it, expect, beforeEach } from 'vitest';
import { employeeStore, EmployeeCreateInput } from './employee.js';

describe('Employee Store', () => {
  beforeEach(() => {
    employeeStore.clear();
  });

  describe('create', () => {
    it('should create a new employee with UUID id', () => {
      const input: EmployeeCreateInput = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+123456789',
        position: 'Developer',
        department: 'IT',
        hireDate: new Date('2023-01-01'),
        salary: 60000,
        status: 'active',
      };

      const employee = employeeStore.create(input);
      
      expect(employee.id).toBeDefined();
      expect(employee.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
      expect(employee.firstName).toBe('John');
      expect(employee.email).toBe('john@example.com');
      expect(employee.hireDate).toBeInstanceOf(Date);
      expect(employee.hireDate.toISOString().split('T')[0]).toBe('2023-01-01');
    });

    it('should accept hireDate as string', () => {
      const input: EmployeeCreateInput = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '+987654321',
        position: 'Manager',
        department: 'HR',
        hireDate: '2024-02-15',
        salary: 80000,
        status: 'active',
      };

      const employee = employeeStore.create(input);
      expect(employee.hireDate).toBeInstanceOf(Date);
      expect(employee.hireDate.getFullYear()).toBe(2024);
      expect(employee.hireDate.getMonth()).toBe(1); // February (0-indexed)
      expect(employee.hireDate.getDate()).toBe(15);
    });
  });

  describe('findAll', () => {
    it('should return empty array initially', () => {
      expect(employeeStore.findAll()).toEqual([]);
    });

    it('should return all employees', () => {
      const emp1 = employeeStore.create({
        firstName: 'A',
        lastName: 'B',
        email: 'a@b.com',
        phone: '+1',
        position: 'P',
        department: 'D',
        hireDate: new Date(),
        salary: 100,
        status: 'active',
      });
      const emp2 = employeeStore.create({
        firstName: 'C',
        lastName: 'D',
        email: 'c@d.com',
        phone: '+2',
        position: 'P',
        department: 'D',
        hireDate: new Date(),
        salary: 200,
        status: 'inactive',
      });

      const all = employeeStore.findAll();
      expect(all).toHaveLength(2);
      expect(all[0].id).toBe(emp1.id);
      expect(all[1].id).toBe(emp2.id);
    });
  });

  describe('findById', () => {
    it('should return employee by id', () => {
      const emp = employeeStore.create({
        firstName: 'Find',
        lastName: 'Me',
        email: 'find@me.com',
        phone: '+123',
        position: 'X',
        department: 'Y',
        hireDate: new Date(),
        salary: 500,
        status: 'active',
      });

      const found = employeeStore.findById(emp.id);
      expect(found).toEqual(emp);
    });

    it('should return undefined for non-existent id', () => {
      expect(employeeStore.findById('non-existent')).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update existing employee', () => {
      const emp = employeeStore.create({
        firstName: 'Old',
        lastName: 'Name',
        email: 'old@example.com',
        phone: '+111',
        position: 'Old',
        department: 'Dept',
        hireDate: new Date(),
        salary: 100,
        status: 'active',
      });

      const updated = employeeStore.update(emp.id, {
        firstName: 'New',
        salary: 200,
      });
      
      expect(updated).toBeDefined();
      expect(updated?.firstName).toBe('New');
      expect(updated?.lastName).toBe('Name'); // unchanged
      expect(updated?.salary).toBe(200);
      expect(updated?.id).toBe(emp.id);

      const fromStore = employeeStore.findById(emp.id);
      expect(fromStore?.firstName).toBe('New');
    });

    it('should return undefined for non-existent id', () => {
      const updated = employeeStore.update('non-existent', { firstName: 'Any' });
      expect(updated).toBeUndefined();
    });

    it('should update hireDate with string', () => {
      const emp = employeeStore.create({
        firstName: 'Test',
        lastName: 'Date',
        email: 'test@example.com',
        phone: '+111',
        position: 'P',
        department: 'D',
        hireDate: '2023-01-01',
        salary: 100,
        status: 'active',
      });

      const updated = employeeStore.update(emp.id, {
        hireDate: '2024-12-31',
      });
      
      expect(updated?.hireDate).toBeInstanceOf(Date);
      expect(updated?.hireDate.getFullYear()).toBe(2024);
      expect(updated?.hireDate.getMonth()).toBe(11); // December
    });
  });

  describe('delete', () => {
    it('should delete existing employee', () => {
      const emp = employeeStore.create({
        firstName: 'ToDelete',
        lastName: 'X',
        email: 'delete@example.com',
        phone: '+111',
        position: 'P',
        department: 'D',
        hireDate: new Date(),
        salary: 100,
        status: 'active',
      });

      const result = employeeStore.delete(emp.id);
      expect(result).toBe(true);
      expect(employeeStore.findById(emp.id)).toBeUndefined();
      expect(employeeStore.findAll()).toHaveLength(0);
    });

    it('should return false for non-existent id', () => {
      const result = employeeStore.delete('non-existent');
      expect(result).toBe(false);
    });
  });

  describe('softDelete', () => {
    it('should mark employee as archived', () => {
      const emp = employeeStore.create({
        firstName: 'Soft',
        lastName: 'Delete',
        email: 'soft@example.com',
        phone: '+111',
        position: 'P',
        department: 'D',
        hireDate: new Date(),
        salary: 100,
        status: 'active',
      });

      const result = employeeStore.softDelete(emp.id);
      expect(result).toBe(true);
      const archived = employeeStore.findById(emp.id);
      expect(archived?.status).toBe('archived');
    });

    it('should return false for non-existent id', () => {
      const result = employeeStore.softDelete('non-existent');
      expect(result).toBe(false);
    });
  });

  describe('clear', () => {
    it('should remove all employees', () => {
      employeeStore.create({
        firstName: 'A',
        lastName: 'B',
        email: 'a@b.com',
        phone: '+1',
        position: 'P',
        department: 'D',
        hireDate: new Date(),
        salary: 100,
        status: 'active',
      });
      expect(employeeStore.findAll()).toHaveLength(1);

      employeeStore.clear();
      expect(employeeStore.findAll()).toHaveLength(0);
    });
  });
});