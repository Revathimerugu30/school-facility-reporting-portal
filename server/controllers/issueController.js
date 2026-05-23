import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import streamifier from 'streamifier';
import Issue from '../models/Issue.js';
import Notification from '../models/Notification.js';
import cloudinary, { cloudinaryConfigured } from '../utils/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads');

const ensureUploadsDir = () => {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
};

const saveLocalImage = (fileBuffer, originalName) => {
  ensureUploadsDir();
  const safeName = `${Date.now()}-${originalName.replace(/[^a-zA-Z0-9.]/g, '-')}`;
  const filePath = path.join(uploadsDir, safeName);
  fs.writeFileSync(filePath, fileBuffer);
  const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
  return `${baseUrl}/uploads/${safeName}`;
};

const uploadImage = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'school-issues', resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

export const createIssue = async (req, res) => {
  const { title, description, category, priority, location } = req.body;
  let imageUrl = '';

  if (!title || !description || !category || !priority || !location) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (req.file) {
    if (cloudinaryConfigured) {
      const result = await uploadImage(req.file.buffer);
      imageUrl = result.secure_url;
    } else {
      imageUrl = saveLocalImage(req.file.buffer, req.file.originalname);
    }
  }

  const issue = await Issue.create({
    title,
    description,
    category,
    priority,
    location,
    image: imageUrl,
    createdBy: req.user._id,
  });

  const notification = await Notification.create({
    userId: req.user._id,
    message: `Your issue "${title}" has been submitted and is pending review.`,
  });

  const io = req.app.get('io');
  if (io) {
    io.to(req.user._id.toString()).emit('notification', notification);
  }

  res.status(201).json(issue);
};

export const getIssues = async (req, res) => {
  const query = {};
  const { status, category, priority, search } = req.query;

  if (req.user.role !== 'admin' && req.user.role !== 'staff') {
    query.createdBy = req.user._id;
  }

  if (status) query.status = status;
  if (category) query.category = category;
  if (priority) query.priority = priority;
  if (search) query.title = { $regex: search, $options: 'i' };

  const issues = await Issue.find(query).populate('createdBy', 'name email role');
  res.json(issues);
};

export const getIssueById = async (req, res) => {
  const issue = await Issue.findById(req.params.id).populate('createdBy', 'name email role');
  if (!issue) return res.status(404).json({ error: 'Issue not found' });
  res.json(issue);
};

export const updateIssue = async (req, res) => {
  const issue = await Issue.findById(req.params.id);
  if (!issue) return res.status(404).json({ error: 'Issue not found' });

  const { status, assignedStaff, title, description, category, priority, location } = req.body;

  if (status) issue.status = status;
  if (assignedStaff) issue.assignedStaff = assignedStaff;
  if (title) issue.title = title;
  if (description) issue.description = description;
  if (category) issue.category = category;
  if (priority) issue.priority = priority;
  if (location) issue.location = location;

  await issue.save();

  if (status) {
    const notification = await Notification.create({
      userId: issue.createdBy,
      message: `Issue "${issue.title}" status updated to ${status}.`,
    });

    const io = req.app.get('io');
    if (io) {
      io.to(issue.createdBy.toString()).emit('notification', notification);
    }
  }

  res.json(issue);
};

export const deleteIssue = async (req, res) => {
  const issue = await Issue.findById(req.params.id);
  if (!issue) return res.status(404).json({ error: 'Issue not found' });

  if (req.user.role !== 'admin' && req.user.role !== 'staff') {
    return res.status(403).json({ error: 'Permission denied' });
  }

  await issue.remove();
  res.json({ message: 'Issue deleted successfully' });
};
