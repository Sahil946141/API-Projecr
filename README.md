# Appointment Booking System API

A RESTful backend API that allows professors to create availability slots and students to book and manage appointments.

##  Project Overview

This system allows:

- Students and Professors to authenticate
- Professors to create available time slots
- Students to view available slots
- Students to book appointments
- Professors to cancel appointments
- Students to check their appointments

The system prevents double booking using atomic database updates.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt (Password Hashing)

##  Project Structure

```
.
├── server.js              # Entry point
├── app.js                 # Express app configuration
├── config/
│   └── db.js              # MongoDB connection
├── controllers/           # Business logic
├── routes/                # API routes
├── models/                # Mongoose schemas
├── middleware/            # Auth & error handling
└── utils/                 # Custom error classes
```

##  Authentication

Authentication is JWT-based.

### Endpoints:

- `POST /auth/register`
- `POST /auth/login`

Each authenticated request requires:

```
Authorization: Bearer <token>
```

Role-based access control is implemented:

- `student`
- `professor`

##  API Endpoints

###  Professor

**Create availability slots:**

```
POST /professors/me/availability
```

**View professor availability:**

```
GET /professors/:professorId/availability
```

**Cancel appointment:**

```
POST /appointments/:appointmentId/cancel
```

###  Student

**Book appointment:**

```
POST /appointments
```

**View own appointments:**

```
GET /students/me/appointments
```

Optional filter:

```
GET /students/me/appointments?status=cancelled
```

##  Database Structure

### Users

- name
- email
- password (hashed)
- role (student / professor)

### Availability Slots

- professorId
- startTime
- endTime
- status (free / booked)

### Appointments

- studentId
- professorId
- slotId
- status (booked / cancelled)
- cancelledBy
- cancellationReason

## ⚙️ Setup Instructions

###  Clone the repository

```bash
git clone <your-repo-url>
cd appointment-booking
```

###  Install dependencies

```bash
npm install
```

### Create a .env file

```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

###  Start the server

```bash
npm run dev
```

or

```bash
npm start
```

##  Key Features

- JWT Authentication
- Role-based access control
- Overlap validation for slots
- Atomic booking to prevent double booking
- Centralized error handling
- Clean modular architecture

##  Demonstration

Two Loom videos included:

- Codebase explanation (architecture, booking logic, database structure)
- Postman demonstration of full user flow

##  Required User Flow Supported

1. Student A1 authenticates
2. Professor P1 authenticates
3. Professor sets availability
4. Student A1 books appointment
5. Student A2 books another slot
6. Professor cancels A1's appointment
7. Student A1 sees no pending appointments
