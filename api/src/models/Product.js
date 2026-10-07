import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Product = sequelize.define(
    'Product',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,

        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: 'products',
        timestamps: true,
        paranoid: true,
        indexes: [{ unique: true, name: 'products_name_unique', fields: ['name'] }],
    }
);

export default Product
