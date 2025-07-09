# Online Learning System - Backend (ExpressJS + MySQL)

This is the backend of the Online Learning System built using ExpressJS and MySQL. It provides RESTful APIs to support user authentication, course management, payments, real-time chat, quizzes, blog, feedback, complaint handling, and role-based access control for Admin, Instructor, Course Manager, and Student.

## Features

- User registration and login with JWT authentication  
- Role-based access: Admin, Student, Instructor, Course Manager  
- Course creation, editing, deleting (by Instructor / Course Manager)  
- Lesson and material management (PDF, link...)  
- Quiz system: add questions, submit answers, scoring  
- Cart, checkout, and order system  
- Payment integration with VNPAY  
- Progress tracking per lesson per user  
- Feedback system: rating and review after enrollment  
- Complaint system with admin resolution  
- Real-time messaging with Socket.IO  
- Blog module: post articles, comment, manage content  
- Admin dashboard APIs: total users, courses, orders, complaints, feedback

## Technologies Used

- ExpressJS (Node.js)
- MySQL (with mysql2)
- JWT for auth
- RESTful API design
- Socket.IO (chat module)
- VNPAY payment gateway
- Multer for file uploads
- bcrypt for password hashing
- CORS, dotenv, middleware-based role checking

## Getting Started

```bash
# Clone the project
git clone https://github.com/vuduy1309/BE-online-learning-system.git
cd BE-online-learning-system

# Install dependencies
npm install

# Start development server
npm run dev
nodemon app.js
node app.js
