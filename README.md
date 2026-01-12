# 🎓 SkillBridge - EdTech Learning Platform

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://skillbridge-edtech.vercel.app/)
[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)]()

**A fully functional ed-tech platform enabling users to create, consume, purchase, and rate educational content.**

[🌐 Live Demo](https://skillbridge-edtech.vercel.app/) • [🚀 Quick Start](#-installation--setup)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation--setup)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
<!-- - [Screenshots](#-screenshots) -->

---

## 🌟 Overview

SkillBridge is a full-stack EdTech platform built with the MERN stack that connects students with instructors globally.

**What it does:**
- 🎓 Students can browse, purchase, and learn from video courses
- 👨‍🏫 Instructors can create and sell courses with rich content
- 💳 Secure payments via Razorpay integration
- 📊 Track learning progress and course analytics
- ⭐ Rate and review courses

### 🎯 Key Highlights

- **Full-Stack MERN Application** with modern architecture
- **RESTful API** with JWT authentication
- **Responsive Design** optimized for all devices
- **Real-time Payment Integration** using Razorpay
- **Cloud Media Management** with Cloudinary
- **Email Notifications** for user actions
- **Progress Tracking System** for enrolled courses
- **Role-Based Access Control** (Student, Instructor, Admin)

---

## ✨ Features

### 👨‍🎓 For Students
- Browse and search courses by categories
- Add courses to cart and purchase via Razorpay
- Watch video lectures with progress tracking
- Rate and review courses
- Track enrolled courses and completion status

### 👨‍🏫 For Instructors
- Create courses with sections and video lectures
- Upload media to Cloudinary
- View analytics dashboard with revenue and enrollment stats
- Edit and manage published courses
- Track student performance and course ratings

### 🔑 For Admins
- Manage users (students and instructors)
- Create and organize course categories
- Platform-wide administrative controls

### 🔐 Security & Authentication
- JWT-based authentication with HTTP-only cookies
- OTP email verification
- Bcrypt password hashing
- Password reset functionality

---

## 💻 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **Framer Motion** - Animations
- **Chart.js** - Analytics visualizations

### Backend
- **Node.js & Express** - Server
- **MongoDB & Mongoose** - Database
- **JWT** - Authentication
- **Bcrypt** - Password encryption

### Third-party Services
- **Cloudinary** - Media storage and delivery
- **Razorpay** - Payment gateway
- **Nodemailer** - Email service

---

## 🏗️ Architecture

```
┌──────────────────┐                    ┌──────────────────┐                    ┌──────────────────┐
│                  │  REST API Calls    │                  │   Mongoose ODM     │                  │
│   React.js       │◄──────────────────►│   Node.js        │◄──────────────────►│   MongoDB        │
│   Frontend       │  (JWT Auth)        │   Express        │   (CRUD Ops)       │   Database       │
│                  │                    │   Backend        │                    │                  │
│  • Redux Store   │                    │  • Auth & JWT    │                    │  • Users         │
│  • React Router  │                    │  • File Upload   │                    │  • Courses       │
│  • TailwindCSS   │                    │  • Validation    │                    │  • Progress      │
└──────────────────┘                    └──────────────────┘                    └──────────────────┘
                                               │
                                               │ API Calls
                                               ▼
                                    ┌─────────────────────┐
                                    │  External Services  │
                                    │  • Cloudinary       │
                                    │  • Razorpay         │
                                    │  • Nodemailer       │
                                    └─────────────────────┘
```

**Three-tier MERN architecture** with external service integrations

### System Architecture Diagram

![Architecture Diagram](screenshots/Architecture%20Diagram.png)

### Database Schema

![Database Schema](screenshots/Schema.png)
 
---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB
- Cloudinary account
- Razorpay account

### Backend Setup

1. Clone the repository
```bash
git clone https://github.com/Nalin-Kumar2004/Skill-Bridge.git
cd Skill-Bridge/backend
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file
```env
PORT=5000
MONGODB_URL=your_mongodb_url
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173

# Cloudinary
CLOUD_NAME=your_cloudinary_name
API_KEY=your_cloudinary_key
API_SECRET=your_cloudinary_secret
FOLDER_NAME=SkillBridge

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret

# Email
MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email
MAIL_PASS=your_app_password
```

4. Start server
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend
```bash
cd ../frontend
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file
```env
VITE_APP_BASE_URL=http://localhost:5000/api/v1
VITE_APP_RAZORPAY_KEY=your_razorpay_key_id
```

4. Start development server
```bash
npm run dev
```

Visit `http://localhost:5173`

---

## 🚀 Deployment

### Backend Deployment (Render)

The backend can be deployed on [Render](https://render.com):
1. Create a new Web Service
2. Connect your GitHub repository
3. Configure settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
4. Add all environment variables from `.env`
5. Deploy and copy the provided URL

**Important:** Set `FRONTEND_URL` to your Vercel deployment URL for CORS.

### Frontend Deployment (Vercel)

The frontend can be deployed on [Vercel](https://vercel.com):
- **Live Demo:** `https://skillbridge-edtech.vercel.app`
1. Import your GitHub repository
2. Framework Preset: Vite
3. Root Directory: `frontend`
4. Add environment variables:
   - `VITE_APP_BASE_URL`: Your Render backend URL + `/api/v1`
   - `VITE_APP_RAZORPAY_KEY`: Your Razorpay key
5. Deploy

### Troubleshooting Deployment
- **CORS Errors:** Ensure `FRONTEND_URL` in backend matches your Vercel URL
- **404 on API calls:** Check `VITE_APP_BASE_URL` includes `/api/v1`
- **Environment variables not working:** Rebuild/redeploy after adding new variables

---

## � API Documentation

### Base URL
```
Local: http://localhost:5000/api/v1
Production: https://your-backend-url.onrender.com/api/v1
```

### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register new user |
| POST | `/auth/login` | User login |
| POST | `/auth/sendotp` | Send OTP for verification |
| POST | `/auth/reset-password-token` | Request password reset |
| POST | `/auth/reset-password` | Reset password |

### Course Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/course/getAllCourses` | Get all published courses |
| GET | `/course/getCourseDetails` | Get single course details |
| POST | `/course/createCourse` | Create new course (Instructor) |
| PUT | `/course/editCourse` | Edit existing course (Instructor) |
| DELETE | `/course/deleteCourse` | Delete course (Instructor) |

### Payment Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/payment/capturePayment` | Initiate payment |
| POST | `/payment/verifyPayment` | Verify payment success |

**Note:** Protected routes require JWT token in cookies or Authorization header.

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

---

## �📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Nalin Kumar**
- 🐙 GitHub: [@Nalin-Kumar2004](https://github.com/Nalin-Kumar2004)
- 💼 LinkedIn: [Connect with me](https://www.linkedin.com/in/nalin-kumar-swe/)
- 📧 Email: nalinnow@gmail.com

---

## ⭐ Show Your Support

Give a ⭐️ if this project helped you or you found it interesting!

### Found a Bug?
Please open an issue with detailed information about the bug and steps to reproduce.

### Want a Feature?
Feel free to open an issue with your feature request!

---

<div align="center">

**Made with ❤️ by Nalin Kumar**

</div>
