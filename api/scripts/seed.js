import 'dotenv/config';
import sequelize from '../src/config/database.js';
import { seedInicial } from '../src/models/index.js';

try {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  await seedInicial();
  console.log('Seed ejecutado correctamente.');
  process.exit(0);
} catch (error) {
  console.error('Error en seed:', error);
  process.exit(1);
}
