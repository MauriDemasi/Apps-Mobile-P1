import { Admin, Client, Product } from "../models/index.js";

export const getMetricasAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.user.id, {
      attributes: { exclude: ["password", "refreshToken"] },
    });

    if (!admin) {
      return res.status(404).json({ estado: false, mensaje: "Administrador no encontrado" });
    }

    const { count: totalClientes } = await Client.findAndCountAll();
    const { count: totalAdmins } = await Admin.findAndCountAll();
    const { count: totalProductos } = await Product.findAndCountAll();

    return res.status(200).json({
      estado: true,
      data: {
        admin,
        metricas: {
          totalClientes,
          totalAdmins,
          totalProductos,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ estado: false, mensaje: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await Client.findAll({
      attributes: { exclude: ["password", "refreshToken"] },
    });
    return res.status(200).json({ estado: true, data: users });
  } catch (error) {
    return res.status(500).json({ estado: false, mensaje: error.message });
  }
}

export const addProduct = async (req, res) => {
  try {
    const { name, price, stock, category } = req.body;

    if (!name || !price || !stock || !category) {
      return res.status(400).json({ estado: false, mensaje: "Todos los campos son obligatorios" });
    }

    const product = await Product.create({ name, price, stock, category });
    return res.status(200).json({ estado: true, data: product });
  } catch (error) {
    return res.status(500).json({ estado: false, mensaje: error.message });
  }
}

export const getReportes = async (req, res) => {
  try {
    const totalClientes = await Client.count();
    const totalAdmins = await Admin.count();
    const totalProductos = await Product.count();

    return res.status(200).json({ estado: true, data: { totalClientes, totalAdmins, totalProductos } });
  } catch (error) {
    return res.status(500).json({ estado: false, mensaje: error.message });
  }
}
