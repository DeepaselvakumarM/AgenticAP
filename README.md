# Invoice Portal

A modern invoice management portal built with React, TypeScript, Vite, Tailwind CSS, and Express. The application supports invoice review, vendor management, dashboard reporting, notifications, and real-time updates.

## Features

- Dashboard with charts and summary cards
- Invoice listing, upload, and status tracking
- Vendor management and vendor-specific insights
- Real-time notifications using Socket.IO
- Responsive UI with light/dark mode support

## Prerequisites

- Node.js 18+ and npm
- A terminal with access to the project folder

## Setup

### 1. Clone and open the project

```bash
git clone <repository-url>
cd invoicePortal
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Install backend dependencies

```bash
cd ../backend
npm install
```

### 4. Configure environment variables

The frontend expects an API base URL via the VITE_API_URL environment variable.

Create a `.env` file in the frontend folder with:

```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Start the backend

```bash
cd backend
npm run dev
```

This starts the Express API on port 5000.

### 6. Start the frontend

In a separate terminal:

```bash
cd frontend
npm run dev
```

The Vite app will open on the local development URL shown in the terminal (usually http://localhost:5173).

## Project Structure

- frontend/
  - src/ - React application entry point, pages, components, hooks, services, and stores
  - public/ - static assets
  - vite.config.ts - Vite configuration
- backend/
  - src/ - Express server, routes, controllers, services, middleware, and socket setup

## Architecture Overview

The project follows a simple full-stack structure:

- Frontend: React + TypeScript + Vite + Tailwind CSS + React Query for data fetching and state management
- Backend: Express + TypeScript with route-based controllers and service layers
- Real-time updates: Socket.IO powers live notifications and UI updates
- Data flow: the frontend calls REST endpoints from the backend, while shared UI state and notifications are managed locally with Zustand and React Query

## Useful Scripts

### Frontend

```bash
cd frontend
npm run dev      # start the Vite dev server
npm run build    # build for production
npm run lint     # run ESLint
```

### Backend

```bash
cd backend
npm run dev      # start the backend with nodemon and tsx
npm run start    # start the backend with nodemon
```

## Notes

- The backend is currently configured to run locally on port 5000.
- The frontend communicates with the backend through the VITE_API_URL value defined in the frontend environment file.
- The UI is organized around feature folders such as invoices, vendors, dashboard, and notifications for easier maintenance.
