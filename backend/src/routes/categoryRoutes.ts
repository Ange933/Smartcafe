/**
 * Routes des catégories
 */

import { Router } from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

// Routes publiques
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Routes protégées (ADMIN seulement)
router.post('/', authenticate, authorize(UserRole.ADMIN), createCategory);
router.put('/:id', authenticate, authorize(UserRole.ADMIN), updateCategory);
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), deleteCategory);

export default router;
