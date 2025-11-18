import mongoose from 'mongoose';

const clienteSchema = new mongoose.Schema(
  {
    razonSocial: {
      type: String,
      required: [true, 'La razón social es obligatoria'],
      trim: true,
    },
    cuit: {
      type: String,
      required: [true, 'El CUIT es obligatorio'],
      unique: true,
      match: [/^\d{2}-?\d{8}-?\d$/, 'CUIT inválido'],
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      lowercase: true,
      trim: true,
    },
    telefono: {
      type: String,
      trim: true,
    },
    direccion: {
      type: String,
      trim: true,
    },
    nominas: {
      type: Number,
      min: [0, 'La cantidad de nóminas no puede ser negativa'],
      default: 0,
    },
    estado: {
      type: String,
      enum: ['activo', 'inactivo'],
      default: 'activo',
    },
  },
  {
    timestamps: true,
  },
);

const Cliente = mongoose.model('Cliente', clienteSchema);
export default Cliente;

