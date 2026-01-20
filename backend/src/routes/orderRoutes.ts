/**
 * Routes des commandes
 */

import { Router } from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  getOrderStats
} from '../controllers/orderController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

// Toutes les routes nécessitent l'authentification
router.use(authenticate);

// Routes accessibles à tous les utilisateurs authentifiés
router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);

// Routes pour WAITER et ADMIN
router.patch('/:id/status', authorize(UserRole.WAITER, UserRole.ADMIN), updateOrderStatus);

// Statistiques (ADMIN + WAITER)
router.get('/stats/summary', authorize(UserRole.ADMIN, UserRole.WAITER), getOrderStats);

export default router;
