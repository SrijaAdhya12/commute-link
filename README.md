# CommuteLink

CommuteLink is a carpool and ride-sharing application with a React frontend and a Spring Boot backend. It allows employees to register, find rides, offer rides, manage bookings, and view available carpool data.

## Tech Stack

### Frontend

- React 19
- Vite
- JavaScript
- Tailwind CSS
- HTML/CSS

### Backend

- Java 25
- Spring Boot 4.1.1
- Spring Web MVC
- Spring Data JPA
- Hibernate / JPA
- H2 Database (default runtime DB)
- PostgreSQL support
- OpenAPI / Swagger via Springdoc

## Project Structure

```bash
commute-link/
├── client/          # React frontend
├── server/          # Spring Boot backend
├── README.md        # Project documentation
└── .gitignore
```

## Prerequisites

Before running the app, make sure you have:

- Node.js and npm installed
- Java 25 installed
- Maven or the included Maven wrapper (`server/mvnw`)

## Start the Client

From the project root:

```bash
cd client
npm install
npm run dev
```

The frontend will typically run on:

```text
http://localhost:5173
```

## Start the Server

From the project root:

```bash
cd server
./mvnw clean install
./mvnw spring-boot:run
```

On Windows PowerShell or Command Prompt, use:

```bash
cd server
mvnw.cmd clean install
mvnw.cmd spring-boot:run
```

The backend will typically run on:

```text
http://localhost:8080
```

## API Documentation

Once the server is running, Swagger UI can be accessed at:

```text
http://localhost:8080/swagger-ui/index.html
```

## Common Commands

### Client build

```bash
cd client
npm run build
```

### Server build

```bash
cd server
./mvnw clean package
```

## Notes

- The frontend and backend are separate services and should be started independently.
- The backend uses H2 as the default runtime database unless configured otherwise.
- If the client needs to connect to the backend, verify the API base URL in the frontend service configuration.
