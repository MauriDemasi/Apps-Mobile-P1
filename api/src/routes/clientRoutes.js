import { Router } from 'express';
import { verifyToken, isClient } from '../middleware/auth.js';
import { getPerfilCliente } from '../controllers/clientController.js';

const router = Router();

router.get('/perfil', verifyToken, isClient, getPerfilCliente);

export default router;
