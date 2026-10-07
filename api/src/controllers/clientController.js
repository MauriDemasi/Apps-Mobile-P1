import { Client } from "../models/index.js";

export const getPerfilCliente = async (req, res) => {
  try {
    const cliente = await Client.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'refreshToken'] }
    });
    if (!cliente) {
      return res.status(404).json({ estado: false, mensaje: "Cliente no encontrado" });
    }
    return res.status(200).json({ estado: true, data: cliente });
  } catch (error) {
    return res.status(500).json({ estado: false, mensaje: error.message });
  }
};
