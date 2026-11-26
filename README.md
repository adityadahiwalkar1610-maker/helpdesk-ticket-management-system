
# Helpdesk Ticket Management System

A full-stack web application for managing helpdesk support requests. Users can create and track tickets, while support staff and administrators can manage ticket status and priority according to their roles.

## Table of Contents

- Overview
- Features
- User Roles
- Ticket Statuses and Priorities
- Technology Stack
- Project Structure
- Prerequisites
- Setup and Installation
- API Endpoints
- Security
- Author

## Overview

The Helpdesk Ticket Management System provides a centralised platform for creating, viewing, and managing support tickets.

The frontend is built using React and Vite. The backend uses Java and Spring Boot, with MySQL for data storage.

## Features

- User registration and login
- JWT-based authentication
- Role-based access control
- Create, view, edit, and delete tickets according to permissions
- Ticket status management
- Ticket priority management
- Password hashing
- Email availability checking
- Password reset functionality
- MySQL database integration
- Protected API endpoints

## User Roles

- **USER:** Can create tickets, view their own tickets, and edit or delete their own OPEN tickets.
- **SUPPORT:** Can view tickets and update ticket status and priority.
- **ADMIN:** Can view tickets and update ticket status and priority.

Access is enforced by the backend.

## Ticket Statuses and Priorities

### Statuses

- OPEN
- IN_PROGRESS
- RESOLVED
- CLOSED

### Priorities

- LOW
- MEDIUM
- HIGH

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- React Router DOM
- Axios
- SweetAlert2
- Lucide React
- CSS

### Backend

- Java 17
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- JWT Authentication
- Maven

### Database

- MySQL

## Project Structure

```text
Helpdesk Ticket Management System/
├── Back-end/
│   └── demo/
│       └── demo/
│           └── src/
│               └── main/
│                   ├── java/
│                   └── resources/
├── Front-end/
│   └── Ticket/
│       ├── public/
│       ├── src/
│       ├── package.json
│       ├── package-lock.json
│       └── vite.config.js
├── .gitignore
└── README.md
```

## Prerequisites

Install the following software:

- JDK 17 or later
- Node.js and npm
- MySQL Server
- Maven

## Setup and Installation

### 1. Clone the Repository

```bash
git clone https://github.com/adityadahiwalkar1610-maker/helpdesk-ticket-management-system.git
cd "Helpdesk Ticket Management System"
```

### 2. Configure MySQL

1. Start your MySQL server.
2. Create the database configured for the application.
3. Configure the database URL, username, and password in your local backend `application.properties`.
4. Configure the JWT secret.

Do not commit real passwords or secret keys to GitHub.

### 3. Run the Backend

Open a terminal inside:

```text
Back-end/demo/demo
```

Run:

```bash
mvn spring-boot:run
```

Backend URL:

```text
http://localhost:8080
```

### 4. Run the Frontend

Open another terminal inside:

```text
Front-end/Ticket
```

Run:

```bash
npm install
npm run dev
```

Open the local frontend URL displayed in your terminal.

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/users/register` | Register a user |
| POST | `/api/users/login` | User login |
| POST | `/api/users/check-email` | Check email availability |
| POST | `/api/users/reset-password` | Reset password |

### Tickets

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tickets` | Get accessible tickets |
| GET | `/api/tickets/{id}` | Get ticket details |
| POST | `/api/tickets` | Create a ticket |
| PUT | `/api/tickets/{id}` | Edit an eligible ticket |
| PATCH | `/api/tickets/{id}/staff` | Staff ticket update |
| DELETE | `/api/tickets/{id}` | Delete an eligible ticket |

Refer to the backend controller classes for the exact request and response formats.

## Security

- Passwords are hashed before storage.
- JWT is used for authentication.
- Role-based authorization restricts access to protected operations.
- Ticket access is controlled by user roles and ticket ownership.
- Database credentials and JWT secrets must not be committed to GitHub.

## Author

**Aditya Dahiwalkar**

## License

This project was developed for educational and assessment purposes.
