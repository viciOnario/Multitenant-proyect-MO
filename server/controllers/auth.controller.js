import User from '../models/user.model.js';
import generateToken from '../utils/generateToken.js';

// @desc    Registrar un nuevo usuario (generalmente 'admin')
// @route   POST /api/auth/register
// @access  Public (o solo Admin en el futuro)
const registerUser = async (req, res) => {
  const { nombre, email, password, role, cliente } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const user = await User.create({
      nombre,
      email,
      password, // Bcrypt se encargará del hash gracias al 'pre-save' hook
      role,
      cliente, // El ObjectId del Cliente si el role es 'cliente'
    });

    if (user) {
      res.status(201).json({
        message: 'Usuario creado exitosamente',
        token: generateToken(user._id, user.role, user.cliente),
      });
    } else {
      res.status(400).json({ message: 'Datos de usuario inválidos' });
    }
  } catch (error) {
    res.status(500).json({ message: `Error: ${error.message}` });
  }
};

// @desc    Autenticar (loguear) un usuario
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Encontrar al usuario y TAMBIÉN pedir la contraseña (que ocultamos con 'select: false')
    const user = await User.findOne({ email }).select('+password');

    // 2. Verificar usuario y contraseña
    if (user && (await user.matchPassword(password))) {
      // 3. Enviar respuesta con el token
      res.json({
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role, user.cliente),
      });
    } else {
      res.status(401).json({ message: 'Email o contraseña inválidos' });
    }
  } catch (error) {
    res.status(500).json({ message: `Error: ${error.message}` });
  }
};

export { registerUser, loginUser };