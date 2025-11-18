import User from '../models/user.model.js';

const listUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate('cliente', 'razonSocial cuit');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { nombre, email, password, role, cliente } = req.body;
    if (!nombre || !email || !password) {
      res.status(400);
      throw new Error('nombre, email y password son obligatorios');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(409);
      throw new Error('El email ya está registrado');
    }

    const user = await User.create({ nombre, email, password, role, cliente });
    res.status(201).json({
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      role: user.role,
      cliente: user.cliente,
      createdAt: user.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { role, cliente } = req.body;
    const updates = {
      ...(role && { role }),
      ...(cliente !== undefined && { cliente }),
    };

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate('cliente', 'razonSocial cuit');

    if (!user) {
      res.status(404);
      throw new Error('Usuario no encontrado');
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('Usuario no encontrado');
    }
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    next(error);
  }
};

export { listUsers, createUser, updateUserRole, deleteUser };

