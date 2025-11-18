import express from 'express';
import {
  registerUser,
  loginUser,
} from '../controllers/auth.controller.js';
// Importamos los middlewares que creamos
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// --- Rutas de Autenticación ---

// @route   POST /api/auth/login
// @desc    Iniciar sesión (autenticar) un usuario
// @access  Public
router.post('/login', loginUser);

// @route   POST /api/auth/register
// @desc    Registrar un nuevo usuario
// @access  Public (Cambiado a Privado/Solo Admin más abajo)
router.post('/register', registerUser);

/* // --- NOTA DE SEGURIDAD PARA EL FUTURO ---
//
// Una vez que tengas tu PRIMER usuario 'admin' registrado,
// deberías cambiar la ruta de registro para que solo otros admins
// puedan crear cuentas nuevas. Se vería así:
//
// router.post('/register', protect, authorize('admin'), registerUser);
//
// Por ahora, la dejamos pública para poder crear el usuario inicial.
*/


/*
// --- Ruta de ejemplo para probar el token ---
// Puedes agregar esto temporalmente para probar tu middleware 'protect'

router.get('/perfil-protegido', protect, (req, res) => {
  res.json({
    message: '¡Acceso concedido! Eres un usuario autenticado.',
    usuario: req.user // req.user fue agregado por el middleware 'protect'
  });
});

// Y esta para probar 'authorize'

router.get('/ruta-admin', protect, authorize('admin'), (req, res) => {
  res.json({
    message: '¡Acceso concedido! Eres un ADMIN.',
    usuario: req.user
  });
});
*/

export default router;