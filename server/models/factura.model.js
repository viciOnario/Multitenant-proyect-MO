import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    descripcion: {
      type: String,
      required: true,
      trim: true,
    },
    cantidad: {
      type: Number,
      required: true,
      min: [1, 'La cantidad mínima es 1'],
    },
    precioUnitario: {
      type: Number,
      required: true,
      min: [0, 'El precio no puede ser negativo'],
    },
  },
  { _id: false },
);

const facturaSchema = new mongoose.Schema(
  {
    numero: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cliente',
      required: true,
    },
    items: {
      type: [itemSchema],
      validate: [arr => arr.length > 0, 'Debe existir al menos un item'],
    },
    total: {
      type: Number,
      required: true,
      min: [0, 'El total no puede ser negativo'],
    },
    fechaEmision: {
      type: Date,
      default: Date.now,
    },
    estado: {
      type: String,
      enum: ['pendiente', 'pagada', 'cancelada'],
      default: 'pendiente',
    },
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

const Factura = mongoose.model('Factura', facturaSchema);
export default Factura;

