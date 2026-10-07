import { Router } from 'express';
import statusRoutes from './statusRoutes.js';
import authRoutes from './authRoutes.js';
import clientRoutes from './clientRoutes.js';
import adminRoutes from './adminRoutes.js';
import productRoutes from './productRoutes.js';

const router = Router();

router.use('/', statusRoutes);
router.use('/auth', authRoutes);
router.use('/client', clientRoutes);
router.use('/admin', adminRoutes);
router.use('/products', productRoutes);

export default router;
