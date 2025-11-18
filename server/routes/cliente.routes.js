import express from 'express';
import {
  createCliente,
  getClientes,
  getClienteById,
  updateCliente,
  deleteCliente,
} from '../controllers/cliente.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('admin'), getClientes)
  .post(protect, authorize('admin'), createCliente);

router
  .route('/:id')
  .get(protect, authorize('admin'), getClienteById)
  .put(protect, authorize('admin'), updateCliente)
  .delete(protect, authorize('admin'), deleteCliente);

export default router;

