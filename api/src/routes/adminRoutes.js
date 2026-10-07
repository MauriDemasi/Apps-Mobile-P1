import { Router } from 'express';
import { verifyToken, isAdmin, checkAdminRole } from '../middleware/auth.js';
import { getMetricasAdmin, getAllUsers, addProduct, getReportes } from '../controllers/adminController.js';

const router = Router();

router.get('/metricas', verifyToken, isAdmin, getMetricasAdmin);

router.get('/usuarios', verifyToken, isAdmin, checkAdminRole(['superadmin']), getAllUsers);

router.post('/productos', verifyToken, isAdmin, checkAdminRole(['gestor_productos', 'superadmin']), addProduct);

router.get('/reportes', verifyToken, isAdmin, checkAdminRole(['auditor', 'superadmin']), getReportes)

export default router;
