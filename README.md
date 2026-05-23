# School Facility Condition Reporting & Repair Tracking Portal

A full-stack web application to report, manage, and track school infrastructure issues with real-time status updates, admin task assignment, and analytics.

## Features

- User registration and login with role-based access
- Issue reporting with image upload and location details
- Admin review, status updates, and repair staff assignment
- Notifications for issue progress
- Responsive dashboard with analytics and charts
- REST API backend with MongoDB Atlas and Cloudinary support

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Recharts
- Backend: Node.js, Express, MongoDB, JWT authentication
- Storage: MongoDB Atlas
- Image Upload: Cloudinary

## Setup

1. Create `.env` files for both `server` and `client` if needed.
2. Install dependencies:
   - `npm install`
3. Start both local servers from the root:
   - `npm run dev`

## Environment Variables

### Server

```
MONGO_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
PORT=5000
```

### Client

```
VITE_API_URL=/api
```

### Default admin account

- Email: `admin@school.local`
- Password: `Admin@123`
- Role: `admin`
- School ID: `ADMIN001`

If no admin user exists, the backend will create this account automatically on startup.

### JWT secret fallback

If `server/.env` is not configured, the backend will use a built-in development JWT secret so login still works locally.

## Local development

Start the backend and frontend together from the root:

```
npm run dev
```

Then open the app in your browser at:

```
http://localhost:5173
```

All API and Socket.IO calls will be proxied through the frontend host so the app works from a single local URL.

## Folder Structure

- `client/` - React frontend
- `server/` - Express backend
