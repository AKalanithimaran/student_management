# Students Management Dashboard

A production-quality full-stack Students Management system built as a monorepo. The app provides real-time CRUD, advanced filtering, export options, and an enterprise-grade UI with optional dark mode.

## Tech Stack

**Frontend**
- Vite + React
- Tailwind CSS
- Axios (API)
- Socket.io client (real-time updates)
- xlsx (Excel/CSV export)
- Chart.js & Recharts (analytics Reports)

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- Socket.io

## Monorepo Structure

```
students-crud-app
+-- frontend
+-- backend
+-- README.md
```

## Core Features

- Full CRUD with MongoDB persistence
- Real-time updates across clients (Socket.io)
- Search, pagination, and server-side filters
- Export options: CSV, Excel, PDF
- Modern enterprise UI + optional dark mode
- Validation and error handling

## Data Model (Student)

Required fields:
- `name` (String, min 2 chars)
- `email` (String, unique)
- `age` (Number, 1–120)
- `status` (String: Active | Pending | Blocked)
- `course` (String)
- `enrollmentDate` (Date)

## API Endpoints

Base: `/api/students`

- `GET /api/students`
  - Query params:
    - `page` (default 1)
    - `limit` (default 10, use 0 for all)
    - `search` (name/email)
    - `ageFilter` (all | 0-18 | 19-25 | 26-40 | 40+)
    - `status` (Active | Pending | Blocked)
    - `course` (string)
    - `enrollmentDate` (YYYY-MM-DD)

- `POST /api/students`
- `PUT /api/students/:id`
- `DELETE /api/students/:id`

## Socket Events

Emitted by backend:
- `studentAdded`
- `studentUpdated`
- `studentDeleted`

Frontend listens and refreshes the table in real time.

## Environment Variables

**Backend** (`backend/.env`)
```
PORT=7001
MONGO_URI=your_mongodb_connection_string
```

**Frontend** (`frontend/.env`)
```
VITE_API_URL=http://localhost:7001
```

## Setup Instructions

### 1) Install backend dependencies
```
cd backend
npm install
```

### 2) Configure backend environment
Create `backend/.env` with the required variables.

### 3) Run backend server
```
npm run dev
```

### 4) Install frontend dependencies
```
cd ../frontend
npm install
```

### 5) Configure frontend environment
Create `frontend/.env` with the required variables.

### 6) Run frontend development server
```
npm run dev
```

Frontend runs on `http://localhost:5050` and backend on `http://localhost:7001` by default.

## UI/UX Highlights

- Collapsible sidebar with icon-only mode
- KPI cards, filters, and export toolbar
- Table with actions menu + right-side detail drawer
- Confirmation modals + toast notifications
- Dark mode with persistence

## Notes

- Existing records created before adding `status/course/enrollmentDate` will display empty values until updated.
- All create/update flows validate required fields on both client and server.
