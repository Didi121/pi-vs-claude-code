import React, { useState, useEffect } from 'react';
import './EmployeeList.css';

const EmployeeList = ({ employees, onDeleteClick, onEditClick, loading, fetchEmployees }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(20);
  const [uniqueDepartments, setUniqueDepartments] = useState([]);
  const [uniqueStatuses] = useState(['active', 'inactive', 'archived']);

  // Extract unique departments from employees
  useEffect(() => {
    const departments = [...new Set(employees.map(emp => emp.department).filter(Boolean))];
    setUniqueDepartments(departments);
  }, [employees]);

  // Apply filters and pagination
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = !searchTerm || 
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = !departmentFilter || employee.department === departmentFilter;
    const matchesStatus = !statusFilter || employee.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Paginate results
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  // Update total pages when filtered employees change
  useEffect(() => {
    setTotalPages(Math.ceil(filteredEmployees.length / limit));
    if (currentPage > Math.ceil(filteredEmployees.length / limit)) {
      setCurrentPage(1);
    }
  }, [filteredEmployees, limit]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDepartmentChange = (e) => {
    setDepartmentFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Trigger API call with new search params
    const queryParams = new URLSearchParams();
    if (searchTerm) queryParams.append('search', searchTerm);
    if (departmentFilter) queryParams.append('department', departmentFilter);
    if (statusFilter) queryParams.append('status', statusFilter);
    queryParams.append('page', currentPage);
    queryParams.append('limit', limit);
    
    fetchEmployees(queryParams.toString());
  };

  if (loading) {
    return <div className="employee-list">Loading employees...</div>;
  }

  return (
    <div className="employee-list">
      <h2>Employee List</h2>
      
      {/* Search and Filter Controls */}
      <div className="search-filters">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </div>
          
          <div className="filter-controls">
            <select 
              value={departmentFilter} 
              onChange={handleDepartmentChange}
              className="filter-select"
            >
              <option value="">All Departments</option>
              {uniqueDepartments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            
            <select 
              value={statusFilter} 
              onChange={handleStatusChange}
              className="filter-select"
            >
              <option value="">All Statuses</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
              ))}
            </select>
            
            <select 
              value={limit} 
              onChange={handleLimitChange}
              className="filter-select"
            >
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </select>
          </div>
        </form>
      </div>

      {/* Results Info */}
      <div className="results-info">
        Showing {paginatedEmployees.length} of {filteredEmployees.length} employees
      </div>

      {/* Employee Table */}
      {paginatedEmployees.length === 0 ? (
        <div className="no-results">No employees found matching your criteria.</div>
      ) : (
        <>
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
              {paginatedEmployees.map((employee) => (
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
                      onClick={() => onEditClick && onEditClick(employee)}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="btn btn-secondary"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              
              <button 
                className="btn btn-secondary"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EmployeeList;