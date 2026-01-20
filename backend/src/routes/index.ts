/**
 * Configuration centrale de toutes les routes de l'API
 */

import { Router } from 'express';
import authRoutes from './authRoutes';
import categoryRoutes from './categoryRoutes';
import productRoutes from './productRoutes';
import orderRoutes from './orderRoutes';
import tableRoutes from './tableRoutes';

const router = Router();

// Routes principales
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/tables', tableRoutes);

// Route de test
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Smart Café opérationnelle',
    timestamp: new Date().toISOString()
  });
});

export default router;
