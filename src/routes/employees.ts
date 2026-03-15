import { Router } from 'express';
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  patchEmployee,
  deleteEmployee,
  softDeleteEmployee,
} from '../controllers/employees.js';

const router = Router();

router.get('/', getEmployees);
router.get('/:id', getEmployeeById);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.patch('/:id', patchEmployee);
router.delete('/:id', deleteEmployee);
router.post('/:id/archive', softDeleteEmployee);

export default router;