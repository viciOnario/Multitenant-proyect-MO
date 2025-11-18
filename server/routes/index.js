import authRoutes from './auth.routes.js';
import clienteRoutes from './cliente.routes.js';
import facturaRoutes from './factura.routes.js';
import userRoutes from './user.routes.js';

const routerAPI = (app) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/clientes', clienteRoutes);
  app.use('/api/facturas', facturaRoutes);
  app.use('/api/users', userRoutes);
};

export default routerAPI;

