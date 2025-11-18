import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    select: false, // Para que no se envíe en las consultas por defecto
  },
  role: {
    type: String,
    enum: ['admin', 'cliente'], // Roles del sistema
    default: 'admin',
  },
  // --- Vínculo Clave ---
  // Si el role es 'cliente', este campo lo vincula a su
  // documento en la colección 'Cliente' (el que tiene el CUIT).
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: function() { return this.role === 'cliente'; }, // Requerido si es un usuario 'cliente'
  }
}, {
  timestamps: true,
});

// Middleware (hook) de Mongoose: Se ejecuta ANTES de guardar.
// Usamos una función normal para poder usar 'this'
UserSchema.pre('save', async function(next) {
  // Solo hashear la contraseña si ha sido modificada (o es nueva)
  if (!this.isModified('password')) {
    return next();
  }

  // Generar el 'salt' y hashear la contraseña
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar la contraseña ingresada con la hasheada en la DB
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);
export default User;