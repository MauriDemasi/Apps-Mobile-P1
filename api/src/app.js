import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes/index.js';
import sequelize from './config/database.js';
import { seedInicial } from './models/index.js';

const app = express();
const PUERTO = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/api', routes)

const iniciarServidor = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');

    await sequelize.sync({ alter: true });
    await seedInicial();

    app.listen(PUERTO, () => {
      console.log(`Servidor iniciado correctamente en el puerto: ${PUERTO}`);
    });
  } catch (error) {
    console.error('No se pudo iniciar el servidor:', error);
    process.exit(1);
  }
};

iniciarServidor();
export default app;
