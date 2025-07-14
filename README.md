# 📝 NoteEase - Full Stack Authentication Project

A production-ready, full-stack Note Taking Web App with modern authentication features using OTP & Google OAuth. Built using **MERN stack (MongoDB, Express, React, Node.js)**.

## Visit the Website

## [NoteEase](fullstack-notes-app-frontend-ten.vercel.app/)

## 🚀 Features

- ✅ Email + OTP Signup & Login (with expiry)
- ✅ Google Sign-In support (with account linking)
- ✅ JWT-based authentication and route protection
- ✅ User-specific notes (Create, Read, Update, Delete)
- ✅ Responsive Dashboard UI (React + Tailwind CSS)
- ✅ Fully functional backend API with validation
- ✅ MongoDB Atlas for cloud storage
- ✅ Email service integration using Gmail + App Passwords

---

## 📦 Folder Structure

```
project-root/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── services/
│   ├── .env
│   └── main.jsx
└── README.md
```

---

## 🛠 Backend Setup

### 1. Clone and open in editor

```bash
git clone https://github.com/maheshhattimare/fullstack-notes-app
cd fullstack-notes-app
```

### 2. Navigate to backend

```bash
cd backend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create `.env` file in `/backend`

```env
PORT=3000
MONGO_URL="mongodb+srv://your-user:your-pass@cluster.mongodb.net/notes-app"
JWT_SECRET=your-jwt-secret

GOOGLE_CLIENT_ID=your-google-client-id
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your-16-digit-app-password
```

### 🔐 How to Get Google Client ID

1. Go to [https://console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project or select existing
3. Navigate to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth Client ID**
5. Select **Web Application**
6. Add the following to Authorized JavaScript origins:

   - `http://localhost:5173`

7. Copy the **Client ID** and paste into both `.env` files (backend & frontend)

### 📧 How to Get Email App Password

1. Go to [https://myaccount.google.com](https://myaccount.google.com)
2. Enable **2-step verification** on your Gmail account
3. Search for **App passwords**
4. Select App: `Other` → Name it: `Notes App`
5. Copy the **16-digit password** and paste into `.env`

---

## 💻 Frontend Setup

### 1. Navigate to frontend folder

```bash
cd ../frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` in `/frontend`

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

### 4. Start the frontend

```bash
npm run dev
```

> Your app should open at `http://localhost:5173`

---

## 🔐 Authentication Flow

- Signup → enters name, DOB, email → gets OTP → verify OTP → JWT issued
- Signin → enter email → get OTP → verify → dashboard
- Google Login → single click → auto-create user if not registered

---

## ✅ Dashboard Features

- Create, update, delete notes
- User-specific note access
- Protected routes using JWT
- Logout and session handling

---

## 🧪 API Endpoints (Summary)

### Auth Routes

- `POST /users/signup`
- `POST /users/verify-otp`
- `POST /users/login`
- `POST /users/google-login`

### Notes Routes (JWT Protected)

- `GET /notes`
- `POST /notes`
- `DELETE /notes/:id`

---

## 🧑‍💻 Author

Made with ❤️ by Mahesh Hattimare
