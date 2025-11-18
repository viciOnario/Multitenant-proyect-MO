import Cliente from '../models/cliente.model.js';

const buildClientePayload = (body) => {
  const { razonSocial, cuit, email, telefono, direccion, estado, nominas } = body;
  return {
    ...(razonSocial !== undefined && { razonSocial }),
    ...(cuit !== undefined && { cuit }),
    ...(email !== undefined && { email }),
    ...(telefono !== undefined && { telefono }),
    ...(direccion !== undefined && { direccion }),
    ...(estado !== undefined && { estado }),
    ...(nominas !== undefined && { nominas }),
  };
};

const createCliente = async (req, res, next) => {
  try {
    const payload = buildClientePayload(req.body);
    if (!payload.razonSocial || !payload.cuit || !payload.email) {
      res.status(400);
      throw new Error('razonSocial, cuit y email son obligatorios');
    }
    if (payload.nominas !== undefined) {
      payload.nominas = Number(payload.nominas);
    }

    const clientExists = await Cliente.findOne({ cuit: payload.cuit });
    if (clientExists) {
      res.status(409);
      throw new Error('Ya existe un cliente con ese CUIT');
    }

    const cliente = await Cliente.create(payload);
    res.status(201).json(cliente);
  } catch (error) {
    next(error);
  }
};

const getClientes = async (req, res, next) => {
  try {
    const clientes = await Cliente.find().sort({ createdAt: -1 });
    res.json(clientes);
  } catch (error) {
    next(error);
  }
};

const getClienteById = async (req, res, next) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      res.status(404);
      throw new Error('Cliente no encontrado');
    }
    res.json(cliente);
  } catch (error) {
    next(error);
  }
};

const updateCliente = async (req, res, next) => {
  try {
    const payload = buildClientePayload(req.body);
    if (payload.nominas !== undefined) {
      payload.nominas = Number(payload.nominas);
    }
    const cliente = await Cliente.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true },
    );

    if (!cliente) {
      res.status(404);
      throw new Error('Cliente no encontrado');
    }

    res.json(cliente);
  } catch (error) {
    next(error);
  }
};

const deleteCliente = async (req, res, next) => {
  try {
    const cliente = await Cliente.findByIdAndDelete(req.params.id);
    if (!cliente) {
      res.status(404);
      throw new Error('Cliente no encontrado');
    }
    res.json({ message: 'Cliente eliminado' });
  } catch (error) {
    next(error);
  }
};

export {
  createCliente,
  getClientes,
  getClienteById,
  updateCliente,
  deleteCliente,
};

