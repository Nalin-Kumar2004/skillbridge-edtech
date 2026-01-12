# 🎓 SkillBridge - EdTech Learning Platform

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)]()
[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)]()



**A fully functional ed-tech platform enabling users to create, consume, purchase, and rate educational content.**

[🌐 Live Demo]( ) • [🚀 Quick Start](#-installation--setup)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation--setup)
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


2. Install dependencies
```bash
npm install
```

3. Create `.env` file
```env
PORT=5000
MONGODB_URL=your_mongodb_url
JWT_SECRET=your_jwt_secret
CLOUD_NAME=your_cloudinary_name
API_KEY=your_cloudinary_key
API_SECRET=your_cloudinary_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email
MAIL_PASS=your_password
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
VITE_BASE_URL=http://localhost:5000/api/v1
```

4. Start development server
```bash
npm run dev
```

Visit `http://localhost:5173`

---



---

## 👨‍💻 Author

**Nalin Kumar**
- GitHub: [@Nalin-Kumar]( https://github.com/Nalin-Kumar2004 )

---

## ⭐ Show your support

Give a ⭐️ if this project helped you!

---

<div align="center">

**Made with ❤️ by Nalin Kumar**

</div>
