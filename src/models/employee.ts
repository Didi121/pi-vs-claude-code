export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hireDate: Date;
  salary: number;
  status: 'active' | 'inactive' | 'archived';
}

export interface EmployeeCreateInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position: string;
  department: string;
  hireDate: Date | string;
  salary?: number;
  status?: 'active' | 'inactive' | 'archived';
}

export interface EmployeeCreateInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position: string;
  department: string;
  hireDate: Date | string;
  salary?: number;
  status?: 'active' | 'inactive' | 'archived';
}

export type EmployeeUpdateInput = Partial<Omit<EmployeeCreateInput, 'hireDate'> & { hireDate?: Date | string }>;

// In-memory store for testing (not for production)
const employees: Employee[] = [];

function normalizeHireDate(date: Date | string): Date {
  if (typeof date === 'string') {
    return new Date(date);
  }
  return date;
}

export const employeeStore = {
  findAll(): Employee[] {
    return employees;
  },
  findById(id: string): Employee | undefined {
    return employees.find(emp => emp.id === id);
  },
  create(data: EmployeeCreateInput): Employee {
    const id = crypto.randomUUID();
    const newEmployee: Employee = { 
      ...data, 
      id,
      hireDate: normalizeHireDate(data.hireDate),
    };
    employees.push(newEmployee);
    return newEmployee;
  },
  update(id: string, data: EmployeeUpdateInput): Employee | undefined {
    const index = employees.findIndex(emp => emp.id === id);
    if (index === -1) return undefined;
    const updatedData = { ...data };
    if (updatedData.hireDate) {
      updatedData.hireDate = normalizeHireDate(updatedData.hireDate);
    }
    employees[index] = { ...employees[index], ...updatedData };
    return employees[index];
  },
  delete(id: string): boolean {
    const index = employees.findIndex(emp => emp.id === id);
    if (index === -1) return false;
    employees.splice(index, 1);
    return true;
  },
  softDelete(id: string): boolean {
    const employee = employees.find(emp => emp.id === id);
    if (!employee) return false;
    employee.status = 'archived';
    return true;
  },
  clear(): void {
    employees.length = 0;
  },
};