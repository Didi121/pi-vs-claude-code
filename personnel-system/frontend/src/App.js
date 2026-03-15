import React, { useState, useEffect } from 'react';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import './App.css';

function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Fetch employees from API
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async (queryParams = '') => {
    setLoading(true);
    try {
      const url = queryParams ? `/api/employees?${queryParams}` : '/api/employees';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEmployees(data.data || []);
    } catch (err) {
      setError('Failed to fetch employees');
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!employeeToDelete) return;

    try {
      const response = await fetch(`/api/employees/${employeeToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete employee: ${response.status}`);
      }

      // Remove employee from local state
      setEmployees(employees.filter(emp => emp.id !== employeeToDelete.id));
      setShowDeleteModal(false);
      setEmployeeToDelete(null);
      
      // Show success message
      alert('Employee deleted successfully');
    } catch (err) {
      setError('Failed to delete employee');
      console.error('Error deleting employee:', err);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setEmployeeToDelete(null);
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      let response;
      
      if (editingEmployee) {
        // Update existing employee
        response = await fetch(`/api/employees/${editingEmployee.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } else {
        // Create new employee
        response = await fetch('/api/employees', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (editingEmployee) {
        // Update employee in local state
        setEmployees(employees.map(emp => 
          emp.id === editingEmployee.id ? result.data : emp
        ));
      } else {
        // Add new employee to local state
        setEmployees([...employees, result.data]);
      }
      
      // Close form and reset state
      setShowForm(false);
      setEditingEmployee(null);
      
      // Show success message
      alert(editingEmployee ? 'Employee updated successfully' : 'Employee added successfully');
      
      // Refresh the employee list
      fetchEmployees();
    } catch (err) {
      setError(editingEmployee ? 'Failed to update employee' : 'Failed to add employee');
      console.error(editingEmployee ? 'Error updating employee:' : 'Error adding employee:', err);
      throw err; // Re-throw to let the form handle it
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingEmployee(null);
  };

  if (loading && employees.length === 0) {
    return <div className="app">Loading...</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Personnel Management System</h1>
      </header>
      
      {error && <div className="error-message">{error}</div>}
      
      <main className="app-main">
        {showForm ? (
          <EmployeeForm 
            employee={editingEmployee}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        ) : (
          <>
            <div className="actions-bar">
              <button className="btn btn-primary" onClick={handleAddEmployee}>
                Add New Employee
              </button>
            </div>
            <EmployeeList 
              employees={employees}
              onDeleteClick={handleDeleteClick}
              loading={loading}
              fetchEmployees={fetchEmployees}
            />
          </>
        )}
      </main>
      
      {showDeleteModal && (
        <DeleteConfirmationModal
          employee={employeeToDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </div>
  );
}

export default App;