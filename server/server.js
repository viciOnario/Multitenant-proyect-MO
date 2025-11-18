import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import conectarDB from './config/db.js';
import routerAPI from './routes/index.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';

conectarDB();

const app = express();

app.use(cors());
app.use(express.json());

routerAPI(app);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});