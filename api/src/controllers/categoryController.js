import { Product } from "../models/index.js";

export const getCategorias = async (req, res) => {
  try {
    const categorias = await Product.findAll({
      attributes: ['category'],
      group: ['category'],
      raw: true,
    });
    if (!categorias) {
      return res.status(404).json({ estado: false, mensaje: "Categorias no encontradas" });
    }
    return res.status(200).json({ estado: true, data: categorias });
  } catch (error) {
    return res.status(500).json({ estado: false, mensaje: error.message });
  }

};
