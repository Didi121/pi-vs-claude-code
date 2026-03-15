import React from 'react';
import './EmployeeList.css';

const EmployeeList = ({ employees, onDeleteClick, loading }) => {
  if (loading) {
    return <div className="employee-list">Loading employees...</div>;
  }

  if (employees.length === 0) {
    return <div className="employee-list">No employees found.</div>;
  }

  return (
    <div className="employee-list">
      <h2>Employee List</h2>
      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Position</th>
            <th>Department</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.firstName} {employee.lastName}</td>
              <td>{employee.email}</td>
              <td>{employee.position}</td>
              <td>{employee.department}</td>
              <td>
                <span className={`status-badge status-${employee.status}`}>
                  {employee.status}
                </span>
              </td>
              <td>
                <button 
                  className="btn btn-secondary"
                  onClick={() => {/* TODO: Implement view details */}}
                >
                  View
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => {/* TODO: Implement edit */}}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => onDeleteClick(employee)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;