import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  category: { type: String, required: true, enum: ['Furniture', 'Electrical', 'Toilet', 'Classroom', 'Water', 'Sanitation'] },
  priority: { type: String, required: true, enum: ['Low', 'Medium', 'High'] },
  location: { type: String, required: true, trim: true },
  image: { type: String },
  status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedStaff: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Issue', issueSchema);
