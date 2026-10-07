import 'dotenv/config';
import sequelize from '../src/config/database.js';

export const limpiarTablas = async () => {
  try {
    await sequelize.authenticate();
    console.log('Ejecutando script de limpieza de base de datos.');
    await sequelize.sync({ force: true });
    console.log('Base de datos reseteada correctamente.');
  } catch (error) {
    console.error('No se pudo limpiar la base de datos:', error);
    process.exit(1);
  }
};

limpiarTablas();
