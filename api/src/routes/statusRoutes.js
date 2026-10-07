import { Router } from 'express';

const router = Router();

router.get('/status', (req, res) => {
  res.json({ estado: true, mensaje: 'API funcionando correctamente' });
});

export default router;
