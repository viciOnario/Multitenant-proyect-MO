import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import {
  crearFactura,
  getTodasLasFacturas,
  getFacturaPorId,
  actualizarFactura,
  eliminarFactura,
  getFacturasDeCliente,
} from '../controllers/factura.controller.js';

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('admin'), getTodasLasFacturas)
  .post(protect, authorize('admin'), crearFactura);

router.get('/cliente/mias', protect, authorize('cliente'), getFacturasDeCliente);
router.get('/cliente/:clienteId', protect, authorize('admin'), getFacturasDeCliente);

router
  .route('/:id')
  .get(protect, getFacturaPorId)
  .put(protect, authorize('admin'), actualizarFactura)
  .delete(protect, authorize('admin'), eliminarFactura);

export default router;