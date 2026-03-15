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

  // Fetch employees from API
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/employees');
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
        <EmployeeList 
          employees={employees}
          onDeleteClick={handleDeleteClick}
          loading={loading}
        />
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