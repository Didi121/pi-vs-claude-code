const express = require('express');
const router = express.Router();

// Placeholder controller functions
const employeeController = require('../controllers/employee.controller');

// GET /api/employees - List employees
router.get('/', employeeController.listEmployees);

// GET /api/employees/:id - Get employee by ID
router.get('/:id', employeeController.getEmployee);

// POST /api/employees - Create new employee
router.post('/', employeeController.createEmployee);

// PUT /api/employees/:id - Fully update employee
router.put('/:id', employeeController.updateEmployee);

// PATCH /api/employees/:id - Partially update employee
router.patch('/:id', employeeController.partialUpdateEmployee);

// DELETE /api/employees/:id - Soft delete employee
router.delete('/:id', employeeController.deleteEmployee);

// POST /api/employees/:id/restore - Restore archived employee
router.post('/:id/restore', employeeController.restoreEmployee);

// GET /api/employees/:id/history - Get employee history
router.get('/:id/history', employeeController.getEmployeeHistory);

module.exports = router;