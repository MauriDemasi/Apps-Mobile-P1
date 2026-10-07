import { Client, Admin } from "../models/index.js";
import bcrypt from "bcryptjs";
import { generarToken, generarRefresh, verificarFirma } from "../utils/jwt.js";

export const loginClient = async (req, res) => {
  const { email, password } = req.body;

  try {
    const client = await Client.findOne({ where: { email } });
    if (!client) {
      return res.status(401).json({ estado: false, mensaje: 'Email o contraseña incorrectos' });
    }
    const passwordValido = await bcrypt.compare(password, client.password);
    if (!passwordValido) {
      return res.status(401).json({ estado: false, mensaje: 'Email o contraseña incorrectos' });
    }

    const token = generarToken({ id: client.id, type: 'client' });
    const tokenRefresh = generarRefresh({ id: client.id, type: 'client' });

    await client.update({ refreshToken: tokenRefresh });

    return res.status(200).json({
      estado: true,
      data: {
        token,
        refreshToken: tokenRefresh,
      },
    });

  } catch (error) {
    return res.status(500).json({ estado: false, mensaje: error.message });
  }

};

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ estado: false, mensaje: 'Email o contraseña incorrectos' });
    }
    const passwordValido = await bcrypt.compare(password, admin.password);
    if (!passwordValido) {
      return res.status(401).json({ estado: false, mensaje: 'Email o contraseña incorrectos' });
    }

    const token = generarToken({ id: admin.id, type: 'admin', role: admin.role });
    const tokenRefresh = generarRefresh({ id: admin.id, type: 'admin', role: admin.role });

    await admin.update({ refreshToken: tokenRefresh });

    return res.status(200).json({
      estado: true,
      data: {
        token,
        refreshToken: tokenRefresh,
      },
    });

  } catch (error) {
    return res.status(500).json({ estado: false, mensaje: error.message });
  }
};

export const refresh = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(401).json({ estado: false, mensaje: 'Sin refresh token' });

  const decoded = verificarFirma(refreshToken);
  if (!decoded) return res.status(401).json({ estado: false, mensaje: 'Refresh inválido o expirado' });

  const Modelo = decoded.type === 'admin' ? Admin : Client;
  const dueno = await Modelo.findByPk(decoded.id);

  if (!dueno || dueno.refreshToken !== refreshToken) {
    return res.status(401).json({ estado: false, mensaje: 'Sesión inválida' });
  }
  const { id, type, role } = decoded;
  const token = generarToken(role ? { id, type, role } : { id, type });
  return res.status(200).json({ estado: true, data: { token } });
};

export const logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    const decoded = verificarFirma(refreshToken);
    if (decoded) {
      const Modelo = decoded.type === 'admin' ? Admin : Client;
      const dueno = await Modelo.findByPk(decoded.id);
      if (dueno) await dueno.update({ refreshToken: null });
    }
  }
  return res.status(200).json({ estado: true, mensaje: 'Sesión cerrada' });
};
