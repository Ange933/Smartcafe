/**
 * Routes des produits
 */

import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

// Routes publiques
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Routes protégées (ADMIN seulement)
router.post('/', authenticate, authorize(UserRole.ADMIN), createProduct);
router.put('/:id', authenticate, authorize(UserRole.ADMIN), updateProduct);
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), deleteProduct);

export default router;
