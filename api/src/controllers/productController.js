import { Op } from "sequelize";
import { Product } from "../models/index.js";

export const getAllProducts = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 5, 1), 50);
    const offset = (page - 1) * limit;

    const where = {};
    if (req.query.search) {
      where.name = { [Op.like]: `%${req.query.search}%` };
    }
    if (req.query.category) {
      where.category = req.query.category;
    }

    const sortBy = ['price', 'name'].includes(req.query.sortBy) ? req.query.sortBy : 'price';
    const order =
      String(req.query.order || 'ASC').toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const { count: total, rows: products } = await Product.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, order]],
    });

    const totalPages = Math.max(Math.ceil(total / limit), 1);

    return res.status(200).json({
      estado: true,
      data: { products, total, page, limit, totalPages },
    });
  } catch (error) {
    return res.status(500).json({ estado: false, mensaje: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, stock, category } = req.body;

    if (!name) {
      return res.status(400).json({ estado: false, mensaje: "El nombre es obligatorio" });
    }
    if (!category) {
      return res.status(400).json({ estado: false, mensaje: "La categoria es obligatoria" });
    }
    if (price == null || stock == null) {
      return res.status(400).json({ estado: false, mensaje: "Precio y stock son obligatorios" });
    }
    if (stock < 0) {
      return res.status(400).json({ estado: false, mensaje: "El stock no puede ser negativo" });
    }
    if (price <= 0) {
      return res.status(400).json({ estado: false, mensaje: "El precio no puede ser 0" });
    }

    const found = await Product.findOne({ where: { name }, paranoid: false });

    if (found && found.deletedAt) {
      await found.restore();
      await found.update({ price, stock, category });
      return res.status(200).json({ estado: true, data: found, restaurado: true });
    }

    if (found) {
      return res.status(400).json({ estado: false, mensaje: "El producto ya existe" });
    }

    const product = await Product.create({ name, price, stock, category });
    return res.status(201).json({ estado: true, data: product, restaurado: false });
  } catch (error) {
    return res.status(500).json({ estado: false, mensaje: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const {id} = req.params;
    const {name, price, stock, category } = req.body;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        estado: false,
        mensaje: "Producto no encontrado",
      });
    }
    if (price == null || stock == null) {
      return res.status(400).json({
        estado: false,
        mensaje: "Precio y stock son obligatorios",
      });
    }

    if (name) {
      const otro = await Product.findOne({ where: { name }, paranoid: false });
      if (otro && String(otro.id) !== String(product.id)) {
        return res.status(400).json({
          estado: false,
          mensaje: "El producto ya existe",
        });
      }
    }
    if (stock < 0) {
      return res.status(400).json({
        estado: false,
        mensaje: "El stock no puede ser negativo",
      });
    }
    if (price <= 0) {
      return res.status(400).json({
        estado: false,
        mensaje: "El precio no puede ser 0",
      });
    }
    if (!name) {
      return res.status(400).json({
        estado: false,
        mensaje: "El nombre es obligatorio",
      });
    }
    if (!category) {
      return res.status(400).json({
        estado: false,
        mensaje: "La categoria es obligatoria",
      });
    }
    const updatedProduct = await product.update({ name, price, stock, category });
    return res.status(200).json({
      estado: true,
      data: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      estado: false,
      mensaje: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const {id} = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        estado: false,
        mensaje: "Producto no encontrado",
      });
    }
    await product.destroy();
    return res.status(200).json({
      estado: true,
      mensaje: "Producto eliminado correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      estado: false,
      mensaje: error.message,
    });
  }
};
