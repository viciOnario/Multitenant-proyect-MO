import jwt from 'jsonwebtoken';
import 'dotenv/config'; // Para acceder a process.env.JWT_SECRET

const generateToken = (id, role, clienteId) => {
  // El 'payload' es la información que guardamos dentro del token.
  // Es visible (no sensible), pero no se puede modificar.
  const payload = {
    id,
    role,
    ...(clienteId && { clienteId }) // Incluye clienteId solo si existe
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '30d', // Duración del token
  });
};

export default generateToken;