# 🚀 CivicSetu

### A Full-Stack Civic Issue Reporting Platform

CivicSetu is a full-stack web application designed to make reporting and tracking civic issues more structured, transparent, and accessible.

Citizens can report civic issues such as road damage, garbage, water problems, streetlight issues, and other civic concerns. Administrators can review reports, monitor their locations, and update their status.

🌐 **Live Website:** https://trycivicsetu.vercel.app

Report. Track. Resolve.

---

## 📌 Overview

The main idea behind CivicSetu is simple:

> **Report → Track → Resolve**

A citizen can create an account, submit a civic issue with its description, location, and photo, and then track the progress of that report.

Administrators have a dedicated dashboard where they can view submitted reports, check their locations, manage reports, and update their status.

---

## ✨ Features

### 👤 Citizen Features

- User registration and login
- JWT-based authentication
- Protected user routes
- Report civic issues
- Add issue category and description
- Add location information
- Upload issue photos
- View submitted reports
- Track report status
- Interactive map for reported issues
- AI-powered CivicSetu chatbot

### 🏛️ Admin Features

- Dedicated admin login
- Role-based access
- Admin dashboard
- View all submitted reports
- View report details
- View report locations on map
- Update report status
- Delete reports
- Monitor civic issues from a centralized dashboard

### 🤖 AI Chatbot

CivicSetu includes an AI-powered chatbot using the Groq API.

The chatbot can:

- Answer questions related to CivicSetu
- Provide information about the platform
- Handle relevant civic-related queries
- Retrieve relevant information from the database for supported questions

---

## 🔐 Authentication Flow

CivicSetu uses JWT-based authentication.

### Signup

```text
User
 ↓
Signup Form
 ↓
Express API
 ↓
Password hashed using bcrypt.js
 ↓
User stored in PostgreSQL



*Login

User
 ↓
Login
 ↓
Express API
 ↓
Password verification
 ↓
JWT generated
 ↓
Token stored on client
 ↓
Protected requests
