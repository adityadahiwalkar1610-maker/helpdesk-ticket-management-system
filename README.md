# Helpdesk Ticket Management System

A full-stack web application for managing helpdesk support requests. Users can create and track tickets, while support staff and administrators can manage ticket status and priority according to their roles.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [User Roles](#user-roles)
- [Ticket Statuses and Priorities](#ticket-statuses-and-priorities)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup and Installation](#setup-and-installation)
- [API Endpoints](#api-endpoints)
- [Security](#security)
- [Author](#author)
- [License](#license)

## Overview

The Helpdesk Ticket Management System provides a centralised way to create, view, and manage support tickets. The frontend is built with React and Vite, the backend uses Java and Spring Boot, and MySQL is used for data storage.

## Features

- User registration and login
- JWT-based authentication
- Role-based access control
- Create, view, edit, and delete tickets according to permissions
- Ticket status management
- Ticket priority management
- MySQL database integration
- Protected API endpoints
- Password hashing
- Email availability checking and password reset functionality

## User Roles

- **USER:** Can create tickets, view their own tickets, and edit or delete their own tickets while they are `OPEN`.
- **SUPPORT:** Can view tickets and update ticket status and priority.
- **ADMIN:** Can view tickets and update ticket status and priority.

Access is enforced by the backend. The exact permissions are determined by the current application implementation.

## Ticket Statuses and Priorities

### Statuses

- `OPEN`
- `IN_PROGRESS`
- `RESOLVED`
- `CLOSED`

### Priorities

- `LOW`
- `MEDIUM`
- `HIGH`

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

- Java 17+
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- JWT authentication
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
├── README.md
└── SETTribe_Intern_Assessment_05.pdf
```

## Prerequisites

Install the following software before running the application:

- JDK 17 or later
- Node.js and npm
- MySQL Server
- Maven, or the Maven Wrapper if it is included in the backend project

## Setup and Installation

### 1. Clone the repository

```bash
git clone https://github.com/adityadahiwalkar1610-maker/helpdesk-ticket-management-system.git
cd helpdesk-ticket-management-system
```

### 2. Configure MySQL and backend settings

1. Start your MySQL server.
2. Create the database configured for the application.
3. Configure the database URL, username, and password in your local backend `application.properties` file.
4. Configure the JWT secret and any other required application settings locally.

The backend configuration file is excluded from version control. Use the values expected by the backend configuration in your local environment.

### 3. Run the backend

Open a terminal in the backend Spring Boot project directory:

```bash
cd Back-end/demo/demo
```

Run the application with Maven:

```bash
mvn spring-boot:run
```

On Windows, if the Maven Wrapper is present, you can use:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend is configured to run at:

```text
http://localhost:8080
```

### 4. Install and run the frontend

Open a second terminal in the frontend application directory:

```bash
cd Front-end/Ticket
npm install
npm run dev
```

Open the local frontend URL printed by Vite in the terminal.

## API Endpoints

The backend exposes REST endpoints under `/api`. The following ticket endpoints are part of the application:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tickets` | Get tickets accessible to the logged-in user |
| `GET` | `/api/tickets/{id}` | Get ticket details |
| `POST` | `/api/tickets` | Create a ticket |
| `PUT` | `/api/tickets/{id}` | Edit an eligible ticket |
| `PATCH` | `/api/tickets/{id}/staff` | Update ticket status and priority (staff/admin) |
| `DELETE` | `/api/tickets/{id}` | Delete an eligible ticket |

User authentication-related endpoints:

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/users/register` | Register a user |
| `POST` | `/api/users/login` | Log in |
| `POST` | `/api/users/check-email` | Check whether an email exists |
| `POST` | `/api/users/reset-password` | Reset a user's password |

Refer to the backend controller classes for the current request and response formats.

## Security

- Passwords are hashed before they are stored.
- JWT is used to authenticate protected requests.
- Role-based authorization restricts access to protected operations.
- Ticket access is controlled by the user's role and ticket ownership.
- Do not commit database credentials, JWT secrets, access tokens, or other private configuration.
- Keep local `application.properties` and `.env` files out of Git.

## Author

**Aditya Dahiwalkar**

## License

This project was developed for educational and assessment purposes.
