import "dotenv/config";
import { verificarFirma } from "../utils/jwt.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ estado: false, mensaje: 'Token no proporcionado' });
  }
  const token = authHeader.split(' ')[1];

  try {
    const decoded = verificarFirma(token);
    if (!decoded) {
      return res.status(401).json({ estado: false, mensaje: 'Token inválido' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ estado: false, mensaje: 'Token inválido' });
  }

};

export const isClient = (req, res, next) => {
  if (req.user.type !== 'client') {
    return res.status(403).json({ estado: false, mensaje: 'No autorizado' });
  }
  next();
};

export const isAdmin = (req, res, next) => {
  if (req.user.type !== 'admin') {
    return res.status(403).json({ estado: false, mensaje: 'No autorizado' });
  }
  next();
};

export const checkAdminRole = (allowedRoles) => (req, res, next) => {

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ estado: false, mensaje: 'No autorizado' });
  }
  next();
}
