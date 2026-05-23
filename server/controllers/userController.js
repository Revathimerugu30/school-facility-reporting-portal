import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const getProfile = async (req, res) => {
  res.json(req.user);
};

export const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { name, email, schoolId, password } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;
  if (schoolId) user.schoolId = schoolId;
  if (password) user.password = await bcrypt.hash(password, 10);

  await user.save();
  res.json({
    message: 'Profile updated successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
    },
  });
};

export const getAllUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};
