# Secure Notes App

A full-stack secure note-taking application with user authentication, OTP login, JWT-based access control, and CRUD operations for notes. Built with **React (Vite)** for the frontend and **Node.js + Express + MongoDB** for the backend.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [License](#license)

---

## Features
- OTP-based login (email)  
- JWT authentication with access token  
- Create, Read, Delete notes (CRUD)  
- Notes are user-specific  
- Simple and clean React UI  

---

## Tech Stack
**Frontend:** React (Vite), Axios, React Router DOM  
**Backend:** Node.js + Express, MongoDB (Mongoose), bcrypt, JWT, Nodemailer  

---

## Getting Started

### Backend Setup
1. Navigate to the backend folder: `cd backend`  
2. Install dependencies: `npm install`  
3. Create a `.env` file in the backend folder and add your environment variables (see below)  
4. Start the server: `npm run dev` (default: `http://localhost:5000`)  

### Frontend Setup
1. Navigate to the frontend folder: `cd frontend`  
2. Install dependencies: `npm install`  
3. Create a `.env` file in the frontend folder with your API URL (see below)  
4. Start the frontend: `node src/index.js` (default: `http://localhost:5173`)  

---

## Environment Variables

### Backend `.env` example
PORT=5000  
MONGO_URI=  
JWT_ACCESS_SECRET=your_access_secret_here  
SMTP_HOST=smtp.gmail.com  
SMTP_PORT=587  
SMTP_USER=your_email@gmail.com  
SMTP_PASS=your_email_app_password  
OTP_EMAIL_FROM=your_email@gmail.com  
GOOGLE_CLIENT_ID=   
GOOGLE_CLIENT_SECRET=  
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

### Frontend `.env` example
VITE_API_URL=http://localhost:5000/api  
VITE_GOOGLE_CLIENT_ID=    

---

## API Endpoints

**Auth**  
POST `/auth/otp/start` – Send OTP to email  
POST `/auth/otp/verify` – Verify OTP and login  
POST `/auth/google` – Login with Google token  

**Notes** (JWT token required)  
GET `/notes` – List user notes  
POST `/notes` – Create a note  
DELETE `/notes/:id` – Delete a note  

---

## Usage
1. Open the frontend in the browser.  
2. Login via email OTP (or Google if implemented).  
3. Add a note by filling in the **Title** and **Body**.  
4. Delete notes as needed.  
5. Only notes created by the logged-in user are visible.  

---

## License
This project is for educational and internship purposes.

**Author:** Ayush Kumar  
**Project:** Secure Notes - Internship Assignment
