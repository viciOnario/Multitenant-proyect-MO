import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import 'dotenv/config';

// Middleware para proteger rutas
const protect = async (req, res, next) => {
  let token;

  // El token vendrá en los headers: 'Bearer <token>'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Obtener el token del header
      token = req.headers.authorization.split(' ')[1];

      // 2. Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Obtener el usuario del token (sin la contraseña) y adjuntarlo a 'req'
      // Ahora, CUALQUIER ruta protegida tendrá acceso a 'req.user'
      req.user = await User.findById(decoded.id).select('-password');
      
      // Almacenamos los datos del payload del token en req.user (incluyendo el role)
      // Esto es más eficiente que hacer otra consulta a la DB si solo necesitamos el role
      // req.user = decoded; 

      next(); // Continuar a la siguiente función (el controlador)
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'No autorizado, token falló' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No autorizado, no hay token' });
  }
};

// Middleware para autorizar por ROL
// Ej: authorize('admin')
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `El rol '${req.user.role}' no tiene permisos para esta acción` 
      });
    }
    next();
  };
};

export { protect, authorize };