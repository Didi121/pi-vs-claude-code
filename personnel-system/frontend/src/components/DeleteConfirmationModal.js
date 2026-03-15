import React from 'react';
import './DeleteConfirmationModal.css';

const DeleteConfirmationModal = ({ employee, onConfirm, onCancel }) => {
  if (!employee) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Confirm Employee Deletion</h3>
        <p>Are you sure you want to delete the following employee?</p>
        
        <div className="employee-details">
          <p><strong>Name:</strong> {employee.firstName} {employee.lastName}</p>
          <p><strong>Email:</strong> {employee.email}</p>
          <p><strong>Position:</strong> {employee.position}</p>
          <p><strong>Department:</strong> {employee.department}</p>
        </div>
        
        <div className="modal-actions">
          <button className="btn btn-danger" onClick={onConfirm}>
            Yes, Delete Employee
          </button>
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;