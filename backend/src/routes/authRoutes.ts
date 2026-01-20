/**
 * Routes d'authentification
 */

import { Router } from 'express';
import { register, login, getProfile, registerWaiter } from '../controllers/authController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

// Routes publiques
router.post('/register', register);
router.post('/login', login);

// Routes protégées
router.get('/profile', authenticate, getProfile);
router.post('/register-waiter', authenticate, authorize(UserRole.ADMIN), registerWaiter);

export default router;
