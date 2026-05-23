import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { protect, authorize } from '../middleware/auth.js';
import { getStats } from '../controllers/adminController.js';

const router = express.Router();

router.get('/stats', protect, authorize('admin'), asyncHandler(getStats));

export default router;
