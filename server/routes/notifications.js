import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { protect } from '../middleware/auth.js';
import { getNotifications, markRead } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', protect, asyncHandler(getNotifications));
router.put('/:id/read', protect, asyncHandler(markRead));

export default router;
