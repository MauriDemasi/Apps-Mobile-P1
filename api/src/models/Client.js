import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcryptjs';

const Client = sequelize.define(
  'Client',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,

      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'clients',
    timestamps: true,
    indexes: [{ unique: true, name: 'clients_email_unique', fields: ['email'] }],
    hooks: {

      beforeCreate: async (client) => {
        if (client.password) {
          client.password = await bcrypt.hash(client.password, 10);
        }
      },

      beforeUpdate: async (client) => {
        if (client.changed('password')) {
          client.password = await bcrypt.hash(client.password, 10);
        }
      },
    },
  }
);

export default Client;
