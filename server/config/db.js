import mongoose from 'mongoose';
import 'dotenv/config';

const conectarDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('MONGODB_URI no está definido en el archivo .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ Conexión a MongoDB exitosa');
  } catch (error) {
    console.error(`❌ Error al conectar con MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default conectarDB;

