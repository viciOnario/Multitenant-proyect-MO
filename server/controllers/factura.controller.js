import Factura from '../models/factura.model.js';

const buildFacturaPayload = (body, userId) => {
  const { numero, cliente, items, total, fechaEmision, estado } = body;

  return {
    ...(numero !== undefined && { numero }),
    ...(cliente !== undefined && { cliente }),
    ...(Array.isArray(items) && { items }),
    ...(total !== undefined && { total }),
    ...(fechaEmision !== undefined && { fechaEmision }),
    ...(estado !== undefined && { estado }),
    ...(userId && { creadoPor: userId }),
  };
};

const validateItems = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('La factura debe contener al menos un item');
  }
};

const crearFactura = async (req, res, next) => {
  try {
    const payload = buildFacturaPayload(req.body, req.user._id);

    if (!payload.numero || !payload.cliente || payload.total === undefined) {
      res.status(400);
      throw new Error('numero, cliente y total son obligatorios');
    }

    validateItems(payload.items);

    const existeFactura = await Factura.findOne({ numero: payload.numero });
    if (existeFactura) {
      res.status(409);
      throw new Error('Ya existe una factura con ese número');
    }

    const factura = await Factura.create(payload);
    res.status(201).json(factura);
  } catch (error) {
    next(error);
  }
};

const getTodasLasFacturas = async (req, res, next) => {
  try {
    const facturas = await Factura.find()
      .populate('cliente', 'razonSocial cuit')
      .populate('creadoPor', 'nombre email')
      .sort({ createdAt: -1 });

    res.json(facturas);
  } catch (error) {
    next(error);
  }
};

const getFacturaPorId = async (req, res, next) => {
  try {
    const factura = await Factura.findById(req.params.id).populate('cliente');
    if (!factura) {
      res.status(404);
      throw new Error('Factura no encontrada');
    }

    const facturaClienteId =
      typeof factura.cliente === 'object' ? factura.cliente._id?.toString() : factura.cliente?.toString();

    if (req.user.role === 'cliente' && facturaClienteId !== req.user.cliente?.toString()) {
      res.status(403);
      throw new Error('No puedes acceder a facturas de otros clientes');
    }

    res.json(factura);
  } catch (error) {
    next(error);
  }
};

const actualizarFactura = async (req, res, next) => {
  try {
    const payload = buildFacturaPayload(req.body);

    if (payload.items) {
      validateItems(payload.items);
    }

    const factura = await Factura.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true },
    );

    if (!factura) {
      res.status(404);
      throw new Error('Factura no encontrada');
    }

    res.json(factura);
  } catch (error) {
    next(error);
  }
};

const eliminarFactura = async (req, res, next) => {
  try {
    const factura = await Factura.findByIdAndDelete(req.params.id);
    if (!factura) {
      res.status(404);
      throw new Error('Factura no encontrada');
    }
    res.json({ message: 'Factura eliminada' });
  } catch (error) {
    next(error);
  }
};

const getFacturasDeCliente = async (req, res, next) => {
  try {
    const clienteId = req.user.role === 'cliente' ? req.user.cliente : req.params.clienteId;

    if (!clienteId) {
      res.status(400);
      throw new Error('No se pudo determinar el cliente');
    }

    const facturas = await Factura.find({ cliente: clienteId }).sort({ createdAt: -1 });
    res.json(facturas);
  } catch (error) {
    next(error);
  }
};

export {
  crearFactura,
  getTodasLasFacturas,
  getFacturaPorId,
  actualizarFactura,
  eliminarFactura,
  getFacturasDeCliente,
};

