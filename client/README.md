# CommuteLink

CommuteLink is a React + Vite + Tailwind CSS ride-sharing app for colleagues, with an optional Spring Boot backend.

## Requirements

- Node.js 20+
- The backend is optional for local development; when available it is used first.

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown by Vite, normally:

```text
http://localhost:5173
```

## Backend URL

Create a `.env` file from `.env.example` to configure the backend URL:

```env
VITE_API_BASE_URL=http://localhost:8080
```

For the deployed frontend on Vercel, set:

```env
VITE_API_BASE_URL=https://YOUR-RENDER-SERVICE.onrender.com
```

Then redeploy the Vercel project.

If the backend cannot be reached, the API service automatically falls back to the sample records in [src/data/db.json](./src/data/db.json). Fallback changes are stored in this browser's localStorage and remain available across reloads. Clear the `tcs-carpool-fallback-db` localStorage entry to reset the local data to the bundled sample records. HTTP errors from a reachable backend are returned normally and do not trigger fallback.

## Main flows

1. Create an employee profile.
2. Browse available cars by nodal point and time slot.
3. Book a seat.
4. View the current booking.
5. Cancel the booking.
6. Offer a car as an employee.

The employee ID is stored in browser localStorage because the backend intentionally has no authentication in this basic version.

## Build

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```
