# ExamEase - Online Examination & Certification System

A comprehensive online examination platform with separate portals for administrators and students. This system enables exam creation, management, and certification with secure authentication and real-time exam delivery.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)
- [Features Breakdown](#features-breakdown)
- [License](#license)

---

## Features

### Admin Panel Features
- Secure admin authentication
- Create and manage exams with detailed configurations
- Add, edit, and delete exam questions
- View all exams in a organized grid layout
- Manage exam metadata (duration, difficulty, passing percentage, etc.)
- Question bank management with MCQ support

### User Portal Features
- User registration and authentication
- Browse available exams with search functionality
- Take exams with real-time timer
- Navigation between questions
- Instant result generation upon submission
- Certificate generation for passed exams (PDF format with QR code)
- Download certificates
- User profile management with avatar upload
- View exam history and statistics
- Change password functionality

### Certificate Features
- Automatic certificate generation for passed exams
- PDF certificate with professional design
- QR code verification on certificates
- Unique verification codes
- Certificate download functionality
- Certificate history tracking

---

## Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool and dev server
- **React Icons** - Icon library
- **CSS3** - Styling with modern glassmorphism effects

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Image storage (avatar uploads)
- **PDFKit** - PDF generation for certificates
- **QRCode** - QR code generation
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

---

## Project Structure

```
project-root/
│
├── admin-frontend/          # Admin panel React application
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home/              # Admin dashboard
│   │   │   ├── Login/             # Admin login
│   │   │   ├── CreateExam/        # Exam creation form
│   │   │   ├── ExamList/          # List all exams
│   │   │   ├── ManageQuestions/   # Question management
│   │   │   ├── Navbar/            # Navigation bar
│   │   │   └── Footer.jsx         # Footer component
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── user-frontend/           # User portal React application
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home/              # User dashboard
│   │   │   ├── Login/             # User login
│   │   │   ├── Register/          # User registration
│   │   │   ├── Exams/             # Browse exams
│   │   │   ├── TakeExam/          # Exam interface
│   │   │   ├── Certificates/      # Certificate gallery
│   │   │   ├── Profile/           # User profile
│   │   │   └── Footer.jsx         # Footer component
│   │   ├── components/
│   │   │   └── Navbar/            # Navigation bar
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── user backend/             # Express.js backend server
    ├── src/
    │   ├── config/
    │   │   └── cloudinary.js      # Cloudinary configuration
    │   ├── middleware/
    │   │   ├── adminAuth.js       # Admin authentication
    │   │   └── userAuth.js        # User authentication
    │   ├── routes/
    │   │   ├── auth.js            # Authentication routes
    │   │   ├── exam.js            # Exam management (admin)
    │   │   ├── question.js        # Question management
    │   │   ├── userExam.js        # User exam routes
    │   │   ├── certificate.js     # Certificate routes
    │   │   └── users.js           # User profile routes
    │   ├── db.js                  # Database connection
    │   └── server.js              # Express server entry point
    ├── generated_certificates/    # PDF storage directory
    └── package.json
```

---

## Prerequisites

Before running this application, ensure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **PostgreSQL** database (v12 or higher)
- **Cloudinary account** (for avatar uploads)
- Git

---

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd project-root
```

### 2. Backend Setup

```bash
cd "user backend"
npm install
```

### 3. Admin Frontend Setup

```bash
cd admin-frontend
npm install
```

### 4. User Frontend Setup

```bash
cd user-frontend
npm install
```

---

## Environment Variables

Create a `.env` file in the **user backend** directory with the following variables:

```env
# Server Configuration
PORT=5000

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/exam_db

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary Configuration (for avatar uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Important Notes:**
- Replace `username`, `password`, and `exam_db` with your PostgreSQL credentials
- Generate a strong JWT secret (use `openssl rand -base64 32`)
- Sign up at [Cloudinary](https://cloudinary.com/) to get API credentials

---

## Database Setup

### 1. Create Database

```bash
psql -U postgres
CREATE DATABASE exam_db;
```

### 2. Database Schema

Run the following SQL to create all necessary tables:

```sql
-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'student',
    profile_picture TEXT,
    phone_number VARCHAR(20),
    bio TEXT,
    date_of_birth DATE,
    address TEXT,
    gender VARCHAR(20),
    preferences JSONB DEFAULT '{}',
    social_links JSONB DEFAULT '[]',
    status VARCHAR(50) DEFAULT 'active',
    total_attempts INTEGER DEFAULT 0,
    passed_exams INTEGER DEFAULT 0,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Exams Table
CREATE TABLE exams (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL,
    number_of_questions INTEGER DEFAULT 0,
    difficulty VARCHAR(50),
    exam_authority VARCHAR(255),
    passing_percentage INTEGER DEFAULT 50,
    max_attempts INTEGER DEFAULT 3,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Questions Table
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) DEFAULT 'MCQ',
    option JSONB NOT NULL,
    correct_answer TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- User Exams (Exam History) Table
CREATE TABLE user_exams (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    taken_at TIMESTAMP DEFAULT NOW()
);

-- Certificates Table
CREATE TABLE certificates (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
    certificate_id VARCHAR(255) UNIQUE NOT NULL,
    verification_code VARCHAR(255) UNIQUE,
    score INTEGER NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    attempt_number INTEGER DEFAULT 1,
    issued_at TIMESTAMP DEFAULT NOW(),
    certificate_url TEXT
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_questions_exam_id ON questions(exam_id);
CREATE INDEX idx_user_exams_user_id ON user_exams(user_id);
CREATE INDEX idx_certificates_user_id ON certificates(user_id);
CREATE INDEX idx_certificates_verification_code ON certificates(verification_code);
```

---

## Running the Application

### Start All Services

You need to run three separate terminals:

#### Terminal 1 - Backend Server

```bash
cd "user backend"
npm run dev
# or
npx nodemon src/server.js
# or
node src/server.js
```

Server runs on: `http://localhost:5000`

#### Terminal 2 - Admin Frontend

```bash
cd admin-frontend
npm run dev
```

Admin panel runs on: `http://localhost:5173` (or next available port)

#### Terminal 3 - User Frontend

```bash
cd user-frontend
npm run dev
```

User portal runs on: `http://localhost:5174` (or next available port)

---

## API Documentation

### Authentication Routes (`/api/auth`)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"  // optional, defaults to "student"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: { "token": "jwt_token_here" }
```

---

### Exam Routes - Admin (`/api/exam`)

All admin routes require `Authorization: Bearer <admin_token>` header.

#### Create Exam
```http
POST /api/exam
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "JavaScript Fundamentals",
  "description": "Test your JavaScript knowledge",
  "duration": 60,
  "number_of_questions": 0,
  "difficulty": "Medium",
  "exam_authority": "Tech Academy",
  "passing_percentage": 70,
  "max_attempts": 3,
  "category": "Programming"
}
```

#### Get All Exams
```http
GET /api/exam
Authorization: Bearer <admin_token>
```

#### Get Single Exam
```http
GET /api/exam/:id
Authorization: Bearer <admin_token>
```

#### Update Exam
```http
PUT /api/exam/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "duration": 90,
  ...
}
```

#### Delete Exam
```http
DELETE /api/exam/:id
Authorization: Bearer <admin_token>
```

---

### Question Routes (`/api/question`)

#### Get Questions for Exam
```http
GET /api/question/:examId
Authorization: Bearer <admin_token>
```

#### Create Question
```http
POST /api/question/:examId
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "question_text": "What is JavaScript?",
  "question_type": "MCQ",
  "option": ["A programming language", "A coffee brand", "A framework", "None"],
  "correct_answer": "A programming language"
}
```

#### Update Question
```http
PUT /api/question/:questionId
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "question_text": "Updated question",
  "option": ["Option A", "Option B", "Option C"],
  "correct_answer": "Option A"
}
```

#### Delete Question
```http
DELETE /api/question/:questionId
Authorization: Bearer <admin_token>
```

---

### User Exam Routes (`/api/user`)

#### Get Available Exams
```http
GET /api/user/
Authorization: Bearer <user_token>
```

#### Get Exam Details
```http
GET /api/user/:examId
Authorization: Bearer <user_token>
```

#### Get Exam Questions
```http
GET /api/user/:examId/questions
Authorization: Bearer <user_token>
```

#### Submit Exam
```http
POST /api/user/:examId/submit
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "answer": {
    "1": "Selected answer for question 1",
    "2": "Selected answer for question 2",
    ...
  }
}

Response:
{
  "message": "Exam submitted successfully",
  "score": 8,
  "total": 10,
  "percentage": 80,
  "status": "passed",
  "attemptNumber": 1,
  "certificateId": "CERT-1234567890-123",
  "verificationCode": "VCODE-ABC123XYZ"
}
```

---

### Certificate Routes (`/api/certificate`)

#### Get User Certificates
```http
GET /api/certificate
Authorization: Bearer <user_token>
```

#### Download Certificate
```http
GET /api/certificate/:certificateId/download
Authorization: Bearer <user_token>

Response: PDF file download
```

---

### User Profile Routes (`/api/profile`)

#### Get Profile
```http
GET /api/profile/me
Authorization: Bearer <user_token>
```

#### Update Profile
```http
PUT /api/profile/me
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "name": "John Doe",
  "phone_number": "+1234567890",
  "bio": "Software Developer",
  "date_of_birth": "1990-01-01",
  "address": "123 Main St",
  "gender": "male",
  "preferences": {},
  "social_links": []
}
```

#### Upload Avatar
```http
POST /api/profile/me/avatar
Authorization: Bearer <user_token>
Content-Type: multipart/form-data

avatar: <image_file>
```

#### Change Password
```http
POST /api/profile/me/change-password
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}
```

---

## User Roles

### Student Role
- Register and login
- Browse available exams
- Take exams with timer
- View results immediately
- Download certificates for passed exams
- Manage profile and upload avatar
- View exam history and statistics

### Admin Role
- Admin login (separate portal)
- Create new exams with full configuration
- Edit existing exams
- Delete exams
- Add questions to exams (MCQ format)
- Edit and delete questions
- View all exams in the system

**Creating Admin User:**
```sql
-- Register through API with role='admin', or manually insert:
INSERT INTO users (name, email, password, role)
VALUES ('Admin', 'admin@example.com', 'hashed_password_here', 'admin');
```

---

## Features Breakdown

### Exam Taking Flow

1. User logs in to user portal
2. Browses available exams with search
3. Clicks on exam to view instructions
4. Starts exam (timer begins)
5. Navigates through questions
6. Submits exam before time expires
7. Views instant results
8. Downloads certificate if passed

### Certificate System

- Certificates are auto-generated upon passing an exam
- Each certificate includes:
  - Student name and exam title
  - Score and percentage
  - Unique certificate ID
  - Verification code
  - QR code for verification
  - Issue date
  - Exam authority signature
- PDF format with professional design
- Stored in `generated_certificates/` folder

### Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control (RBAC)
- Protected API routes
- Secure file uploads via Cloudinary
- SQL injection prevention via parameterized queries

### User Experience

- Modern glassmorphism UI design
- Responsive layouts for all devices
- Real-time timer during exams
- Question navigation sidebar
- Visual feedback for answered questions
- Dark theme for reduced eye strain
- Smooth transitions and animations

---

## Default Credentials

For testing, you can create accounts through the registration page or use these SQL inserts:

### Admin Account
```sql
-- Password: admin123 (hashed)
INSERT INTO users (name, email, password, role)
VALUES ('Admin User', 'admin@test.com', '$2a$10$encrypted_password_here', 'admin');
```

### Student Account
```sql
-- Password: student123 (hashed)
INSERT INTO users (name, email, password, role)
VALUES ('Test Student', 'student@test.com', '$2a$10$encrypted_password_here', 'student');
```

**Note:** You need to hash passwords properly using bcryptjs before inserting.

---

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running: `sudo service postgresql status`
- Check DATABASE_URL in `.env` file
- Ensure database exists: `psql -l`

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000
# Kill the process
kill -9 <PID>
```

### Cloudinary Upload Errors
- Verify API credentials in `.env`
- Check file size limits (default 2MB)
- Ensure file format is JPG/PNG

### JWT Token Errors
- Check JWT_SECRET is set in `.env`
- Verify token expiration (default 1 hour)
- Clear localStorage and re-login

---

## Future Enhancements

- Multiple question types (True/False, Fill in blanks)
- Exam scheduling functionality
- Email notifications for certificates
- Online proctoring features
- Question randomization
- Excel import for bulk questions
- Analytics dashboard for admins
- Mobile app version
- Payment gateway integration
- Multi-language support

---

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## License

This project is licensed under the MIT License.

---

## Support

For issues and questions:
- Create an issue on GitHub
- Email: support@examease.com

---

## Acknowledgments

- React team for the amazing framework
- Express.js community
- PostgreSQL for robust database
- Cloudinary for image hosting
- All open-source contributors

---

**Built with care for secure and fair assessments.**
