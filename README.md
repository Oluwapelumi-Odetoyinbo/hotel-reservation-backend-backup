# Hotel Reservation System - Backend API

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green)

A secure backend system for hotel reservations with JWT authentication, user management, and password reset functionality.

## Features

- **Authentication System**
  - Admin/customer login with JWT
  - Role-based access control
  - Secure password hashing (bcrypt)
  
- **User Management**
  - Admin creation (manual)
  - Customer account creation (admin-only)
  - Password change functionality

- **Security**
  - JWT authentication (1h expiry)
  - Password reset tokens (1h expiry)
  - Input validation/sanitization
  - Secure HTTP headers (Helmet)

- **Email Notifications**
  - Account creation emails
  - Password reset emails

## Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript 5
- **Framework**: Express 4
- **Database**: MongoDB 6+
- **Auth**: JWT, bcrypt
- **Email**: Nodemailer

## Setup

### Prerequisites

1. Node.js 18+
2. MongoDB (local or Atlas)
3. SMTP credentials (SendGrid/Mailgun/etc.)

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
