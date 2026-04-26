# 🦷 Sekhar Dental Clinic — Full-Stack Website

A production-ready dental clinic website built with **React + Vite** (frontend) and **Node.js + Express** (backend).

---

## 📁 Project Structure

```
clinic/
├── frontend/                # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route-level page components
│   │   ├── layouts/         # Layout wrappers
│   │   ├── services/        # Axios API service layer
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Constants and helpers
│   │   └── constants.js     # App-wide constants (ES module)
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── backend/                 # Express.js REST API
│   ├── controllers/         # Route handler logic
│   ├── routes/              # Express route definitions
│   ├── middleware/          # Auth, validation, error handling
│   ├── utils/               # Utilities
│   ├── db/                  # MongoDB connection
│   ├── constants.js         # App-wide constants (CommonJS)
│   └── package.json
│
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- npm >= 9

### 1. Install dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure environment variables

```bash
# Backend
cd backend
copy .env.example .env
# Edit backend/.env with your values

# Frontend
cd ../frontend
copy .env.example .env
```

### 3. Run in development mode

```bash
# Terminal 1 — Start the backend server (port 5000)
cd backend
npm run dev

# Terminal 2 — Start the frontend dev server (port 5173)
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🏗️ Production Build

```bash
# Build the frontend
cd frontend
npm run build
# Output goes to: frontend/dist/

# Start production server (serves API + static frontend)
cd ../backend
NODE_ENV=production npm start
```

The Express server will automatically serve the built React app in production mode.

---

## 🔌 API Reference

| Method | Endpoint                        | Auth   | Description               |
|--------|---------------------------------|--------|---------------------------|
| GET    | /api/health                     | —      | Health check              |
| GET    | /api/services                   | —      | Get all services          |
| GET    | /api/services/:slug             | —      | Get single service        |
| POST   | /api/appointments               | —      | Book appointment          |
| GET    | /api/appointments/:id           | —      | Get appointment details   |
| POST   | /api/contact                    | —      | Send contact message      |
| POST   | /api/admin/login                | —      | Admin authentication      |
| GET    | /api/admin/appointments         | Bearer | View all appointments     |
| GET    | /api/admin/messages             | Bearer | View all contact messages |
| PATCH  | /api/admin/appointments/:id/status | Bearer | Update appointment status |

---

## 🔐 Admin Access

Default credentials (⚠️ change in production!):
- **Username:** `admin`
- **Password:** `admin123`

Admin panel: http://localhost:5173/admin

---

## 🗄️ MongoDB Migration Guide

The app uses JSON file storage which is designed to be easily swapped:

1. **Install Mongoose**
   ```bash
   cd backend
   npm install mongoose
   ```

2. **Add MongoDB URI to `.env`**
   ```env
   MONGODB_URI=mongodb://localhost:27017/smilecare
   ```

3. **Create Mongoose schemas** in `backend/models/`:
   ```js
   // backend/models/Appointment.js
   const mongoose = require('mongoose');
   const AppointmentSchema = new mongoose.Schema({
     name: { type: String, required: true },
     phone: { type: String, required: true },
     // ... other fields
   }, { timestamps: true });
   module.exports = mongoose.model('Appointment', AppointmentSchema);
   ```

4. **Update controllers** — replace `fileStorage` utility imports with Mongoose model calls:
   ```js
   // Before (file storage)
   const { appendData, readData } = require('../utils/fileStorage');
   const appointments = readData('appointments.json');

   // After (MongoDB)
   const Appointment = require('../models/Appointment');
   const appointments = await Appointment.find().sort({ createdAt: -1 });
   ```

5. **Connect to MongoDB** in `backend/index.js`:
   ```js
   const mongoose = require('mongoose');
   mongoose.connect(process.env.MONGODB_URI);
   ```

---

## 🌟 Features

- ✅ Responsive, mobile-first design
- ✅ Smooth Framer Motion animations
- ✅ SEO optimized (meta tags + JSON-LD structured data)
- ✅ Book appointment form with validation
- ✅ WhatsApp floating chat button
- ✅ Call Now button for mobile
- ✅ Testimonial carousel
- ✅ Google Maps embed
- ✅ FAQ accordion
- ✅ Admin dashboard (protected by JWT)
- ✅ File-based JSON storage (MongoDB-ready)
- ✅ Security headers (Helmet.js)
- ✅ Input validation (express-validator)
- ✅ Global error handling
- ✅ Environment variable support

---

## 🔧 Environment Variables

### `backend/.env`
```env
PORT=5000
NODE_ENV=development
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
JWT_SECRET=change_this_to_a_long_random_string_in_production
CLIENT_URL=http://localhost:5173
```

### `frontend/.env`
```env
VITE_API_URL=/api
```

---

## 📦 Tech Stack

**Frontend:** React 18, Vite, TailwindCSS, React Router v6, Framer Motion, React Hook Form, Axios, Lucide React, React Hot Toast

**Backend:** Node.js, Express.js, express-validator, jsonwebtoken, bcryptjs, Helmet, Morgan, Compression

---

*Built with ❤️ for Sekhar Dental Clinic*
