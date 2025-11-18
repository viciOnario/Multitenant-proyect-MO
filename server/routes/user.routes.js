import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import {
  listUsers,
  createUser,
  updateUserRole,
  deleteUser,
} from '../controllers/user.controller.js';

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('admin'), listUsers)
  .post(protect, authorize('admin'), createUser);

router
  .route('/:id')
  .put(protect, authorize('admin'), updateUserRole)
  .delete(protect, authorize('admin'), deleteUser);

export default router;

