import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { getProfile, updateProfile, getAllUsers } from '../controllers/userController.js';

const router = express.Router();

router.get('/me', protect, getProfile);
router.put('/me', protect, updateProfile);
router.get('/', protect, authorize('admin'), getAllUsers);

export default router;
