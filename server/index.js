import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { MongoMemoryServer } from 'mongodb-memory-server';

import authRoutes from './routes/auth.js';
import User from './models/User.js';
import issueRoutes from './routes/issues.js';
import notificationRoutes from './routes/notifications.js';
import userRoutes from './routes/users.js';
import adminRoutes from './routes/admin.js';

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const server = createServer(app);

const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';

const io = new SocketIOServer(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (origin === allowedOrigin || origin.includes('localhost')) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 5000;

app.set('io', io);

// Socket connection
io.on('connection', (socket) => {
  socket.on('join', ({ userId }) => {
    if (userId) {
      socket.join(userId);
    }
  });
});

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = process.env.CLIENT_URL || 'http://localhost:5173';
      if (!origin) return callback(null, true);
      if (origin === allowed || origin.includes('localhost')) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Serve frontend build if available
const clientDist = path.join(__dirname, '..', 'client', 'dist');

if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));

  app.get('*', (req, res) => {
    const indexPath = path.join(clientDist, 'index.html');

    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }

    res.status(404).json({ error: 'Not found' });
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      message: 'School Facility Reporting API Running',
    });
  });
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    error: err.message || 'Server error',
  });
});

// Seed default admin
const seedAdmin = async () => {
  try {
    // Only attempt to seed if mongoose is connected
    if (mongoose.connection.readyState !== 1) {
      return; // Skip if not connected
    }

    const adminEmail =
      process.env.DEFAULT_ADMIN_EMAIL || 'seed-admin@school.local';

    const adminPassword =
      process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123';

    const adminName =
      process.env.DEFAULT_ADMIN_NAME || 'Admin';

    const adminSchoolId =
      process.env.DEFAULT_ADMIN_SCHOOL_ID || 'ADMIN001';

    const existingAdmin = await User.findOne({
      email: adminEmail,
    });

    if (existingAdmin) return;

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await User.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      schoolId: adminSchoolId,
    });

    console.log('Default admin created');
  } catch (error) {
    // Silently skip on error - server will still work
  }
};

// MongoDB connection with fallback to in-memory database
const connectDatabase = async () => {
  try {
    if (process.env.MONGO_URI && process.env.MONGO_URI.includes('mongodb')) {
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 3000,
        socketTimeoutMS: 3000,
      });
      console.log('✅ Connected to MongoDB');
      return;
    }
  } catch (error) {
    console.log('📦 MongoDB unavailable, using in-memory database...');
  }

  // Fallback to in-memory database
  try {
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to in-memory database');
  } catch (error) {
    console.error('❌ Database startup failed:', error.message);
    process.exit(1);
  }
};

// Start server with proper async handling
(async () => {
  try {
    await connectDatabase();
    await seedAdmin();
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Startup failed:', error.message);
    process.exit(1);
  }
})();