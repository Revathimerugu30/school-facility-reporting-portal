import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const getJwtSecret = () => process.env.JWT_SECRET || 'dev_jwt_secret';
const signToken = (id) => jwt.sign({ id }, getJwtSecret(), { expiresIn: '7d' });

export const register = async (req, res) => {
  const { name, email, password, role, schoolId } = req.body;

  if (!name || !email || !password || !role || !schoolId) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email: normalizedEmail, password: hashedPassword, role, schoolId });

  res.status(201).json({
    token: signToken(user._id),
    user: { id: user._id, name: user.name, email: user.email, role: user.role, schoolId: user.schoolId }
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({
    token: signToken(user._id),
    user: { id: user._id, name: user.name, email: user.email, role: user.role, schoolId: user.schoolId }
  });
};

export const me = async (req, res) => {
  res.json({ user: req.user });
};
