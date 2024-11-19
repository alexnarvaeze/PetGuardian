# Pet Guardian

**Pet Guardian** is a health and wellness app designed to help pet owners monitor and manage their pets' health needs efficiently. This app provides tools for tracking medical records, vaccination schedules, and overall wellness, making it easier for pet owners to focus on proactive care.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Installation](#installation)
4. [Usage](#usage)
5. [API Endpoints](#api-endpoints)
6. [Technologies Used](#technologies-used)
7. [Folder Structure](#folder-structure)
8. [Contributing](#contributing)
9. [License](#license)

---

## Project Overview

Pet Guardian offers a centralized solution for pet owners to track and manage their pets' health information, schedule check-ups, and get reminders for vaccinations and other essential health milestones.

## Features

- **User Authentication**: Signup and login for secure access
- **Health Tracking**: Keep a log of pet medical records, medications, and treatments
- **Vaccination Reminders**: Stay on top of vaccination schedules with reminders
- **Wellness Insights**: Monitor weight, activity levels, and other health metrics

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [SQLite3](https://sqlite.org/)

### Steps

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/pet-guardian.git
   cd pet-guardian
   ```

2. **Install dependencies**:

   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Start the SQLite Database**:
   Ensure that you have SQLite3 installed, and that your database (`database.sqlite`) is in the backend folder.

4. **Run the project**:

   ```bash
   # Start the backend server
   cd backend
   node server.js

   # Start the frontend
   cd ../client
   npm start
   ```

## Usage

1. **Signup**: Go to `/signup` to create a new account.
2. **Login**: Log in at `/login` using your credentials.
3. **Access Protected Route**: After login, navigate to `/home` to access the main app functionality.

## API Endpoints

### POST `/api/auth/signup`

- **Description**: Register a new user
- **Body**: `{ "name": "Name", "username": "Username", "password": "Password" }`
- **Response**: Success or error message

### POST `/api/auth/login`

- **Description**: Authenticate user and retrieve token
- **Body**: `{ "username": "Username", "password": "Password" }`
- **Response**: Success message and token, or error message

### Protected Routes

Access to routes like `/home` and other pet health features requires a valid token.

## Technologies Used

- **Frontend**: React, Axios, React Router
- **Backend**: Express.js
- **Database**: SQLite
- **Authentication**: JSON Web Token (JWT)

## Folder Structure

```plaintext
pet-guardian/
├── backend/              # Backend application
│   ├── server.js         # Main server file
│   ├── database.sqlite   # SQLite database file
│   └── package.json      # Backend dependencies
├── client/               # Frontend React application
│   ├── public/
│   └── src/
│       ├── Components/   # React components for Signup, Login, and main app features
│       ├── App.js        # Main App component
│       └── index.js      # Entry point for React
├── README.md             # Project documentation
```
