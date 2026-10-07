import { Router } from 'express';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { verifyToken, isAdmin,checkAdminRole } from '../middleware/auth.js';
import { getCategorias } from '../controllers/categoryController.js';

const router = Router();

router.get('/', getAllProducts);
router.get('/categorias', getCategorias)
router.post('/', verifyToken, isAdmin, checkAdminRole(['superadmin', 'gestor_productos']), createProduct);
router.put('/:id', verifyToken, isAdmin, checkAdminRole(['superadmin', 'gestor_productos']), updateProduct);
router.delete('/:id', verifyToken, isAdmin,checkAdminRole(['superadmin']), deleteProduct);

export default router;
