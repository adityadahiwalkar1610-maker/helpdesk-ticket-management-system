# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.







///////////////////////////////////////////////////////////////////////////////////////////////////////////






# Helpdesk Ticket Management System

## Project Overview

The Helpdesk Ticket Management System is a web-based application that allows users to create and manage support tickets. Support staff and administrators can view tickets and update their status and priority.

## Technologies Used

### Frontend
- React.js
- React Router
- Axios
- CSS

### Backend
- Java 17+
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- JWT Authentication

### Database
- MySQL

## User Roles

- **USER:** Can create tickets, view their own tickets, and edit or delete their own OPEN tickets.
- **SUPPORT:** Can view all tickets and update ticket status and priority.
- **ADMIN:** Can view all tickets and update ticket status and priority.

## Main Features

- User registration and login
- JWT-based authentication
- Role-based access control
- Create, view, edit, and delete tickets according to permissions
- Ticket status management
- Ticket priority management
- MySQL database integration
- Protected API endpoints

## Ticket Statuses

- OPEN
- IN_PROGRESS
- RESOLVED
- CLOSED

## Ticket Priorities

- LOW
- MEDIUM
- HIGH

## Project Structure

```text
Helpdesk-Ticket-Management-System/
├── backend/
├── frontend/
├── database/
│   └── helpdesk_queries.sql
├── README.md
└── .gitignore
```

## Setup and Installation

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd Helpdesk-Ticket-Management-System
```

### 2. Configure MySQL

Create the database in MySQL:

```sql
CREATE DATABASE helpdesk;
```

Configure your database URL, username, password, and JWT secret using environment variables on your local machine.

Do not commit real passwords or secret keys.

### 3. Run the Backend

Open a terminal inside the backend folder:

```bash
cd backend
```

Run the Spring Boot application:

```bash
mvn spring-boot:run
```

On Windows, if using the Maven wrapper:

```bash
mvnw.cmd spring-boot:run
```

Backend URL:

```text
http://localhost:8080
```

### 4. Run the Frontend

Open another terminal inside the frontend folder:

```bash
cd frontend
npm install
npm run dev
```

Open the local frontend URL displayed in your terminal.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tickets` | Get tickets accessible to the logged-in user |
| GET | `/api/tickets/{id}` | Get ticket details |
| POST | `/api/tickets` | Create a ticket |
| PUT | `/api/tickets/{id}` | Edit an OPEN ticket |
| PATCH | `/api/tickets/{id}/staff` | Update ticket status and priority |
| DELETE | `/api/tickets/{id}` | Delete an eligible ticket |

Authentication endpoints should be documented using the actual mappings in the backend controller.

## Database Queries

SQL queries for displaying, filtering, counting, joining, and updating tickets are available in:

```text
database/helpdesk_queries.sql
```

## Security

- Passwords are stored using password hashing.
- JWT is used for authentication.
- Role-based authorization restricts access to protected operations.
- Users can access only their own tickets.
- Sensitive credentials and secret keys must be configured locally and must not be committed to GitHub.

## Author

Aditya Dahiwalkar

## License

This project was developed for educational and assessment purposes.
