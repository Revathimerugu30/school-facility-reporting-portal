import express from 'express';
import multer from 'multer';
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

router.post('/create', protect, upload.single('image'), createIssue);
router.get('/', protect, getIssues);
router.get('/:id', protect, getIssueById);
router.put('/:id', protect, authorize('admin', 'staff'), updateIssue);
router.delete('/:id', protect, authorize('admin', 'staff'), deleteIssue);

export default router;
