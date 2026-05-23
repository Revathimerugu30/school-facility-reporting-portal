import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['parent', 'teacher', 'admin', 'staff'], default: 'parent' },
  schoolId: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
