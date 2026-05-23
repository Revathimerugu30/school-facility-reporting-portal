import express from 'express';
import multer from 'multer';
import { asyncHandler } from '../utils/asyncHandler.js';
import { protect, authorize } from '../middleware/auth.js';
import {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
} from '../controllers/issueController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/create', protect, upload.single('image'), asyncHandler(createIssue));
router.get('/', protect, asyncHandler(getIssues));
router.get('/:id', protect, asyncHandler(getIssueById));
router.put('/:id', protect, authorize('admin', 'staff'), asyncHandler(updateIssue));
router.delete('/:id', protect, authorize('admin', 'staff'), asyncHandler(deleteIssue));

export default router;
