import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { protect, authorize } from '../middleware/auth.js';
import { getProfile, updateProfile, getAllUsers } from '../controllers/userController.js';

const router = express.Router();

router.get('/me', protect, asyncHandler(getProfile));
router.put('/me', protect, asyncHandler(updateProfile));
router.get('/', protect, authorize('admin'), asyncHandler(getAllUsers));

export default router;
