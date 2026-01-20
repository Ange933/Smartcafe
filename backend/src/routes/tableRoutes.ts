/**
 * Routes des tables
 */

import { Router } from 'express';
import {
  getAllTables,
  getTableById,
  createTable,
  updateTableStatus,
  deleteTable
} from '../controllers/tableController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

// Routes accessibles à tous (lecture)
router.get('/', getAllTables);
router.get('/:id', getTableById);

// Routes protégées
router.post('/', authenticate, authorize(UserRole.ADMIN), createTable);
router.patch('/:id/status', authenticate, authorize(UserRole.WAITER, UserRole.ADMIN), updateTableStatus);
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), deleteTable);

export default router;
