# Dayflow — Human Resource Management System (HRMS)

> **“Every workday, perfectly aligned.”**

Dayflow is a modern, full-stack Human Resource Management System built for growing organizations. It streamlines workforce operations with role-based access control, live attendance punch-in/out, leave requests & approval workflows, itemized payroll calculations, realtime in-app notifications, and executive HR analytics.

---

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Application Structure](#application-structure)
- [Demo Credentials](#demo-credentials)
- [Installation & Setup](#installation--setup)
- [Database Configuration (MySQL)](#database-configuration-mysql)
- [Running the Application](#running-the-application)
- [API Overview](#api-overview)
- [Future Enhancements](#future-enhancements)

---

## Features

### 1. Role-Based Access Control (RBAC)
- **HR Administrator**: Full organization overview, workforce management (CRUD), attendance override, leave review & decisions with comments, payroll adjustment with live formula calculation.
- **Employee**: Personal punch dashboard, working hours tracker, leave quota balance & history, read-only compensation breakdown, profile management.

### 2. Live Attendance Management
- Real-time **Check In** and **Check Out** with validation safeguards.
- Automated working hours calculation.
- Attendance status classification: `Present`, `Absent`, `Half Day`, `Leave`.
- Admin filtering by employee, date range, and status with manual adjustments.

### 3. Leave Management & Approval Engine
- Allocation counters for **Paid Leave**, **Sick Leave**, and **Unpaid Leave**.
- Leave application modal with reason, date range selection, and quota validation.
- Interactive admin approval queue with comments and automatic employee notifications.

### 4. Payroll & Compensation Hub
- Transparent salary formulation:
  $$\text{Net Salary} = \text{Basic Salary} + \text{Allowances} - \text{Deductions}$$
- Itemized salary components with payment status tracking.
- Strict data privacy preventing cross-employee payroll exposure.

### 5. Executive HR Analytics & Dashboard
- Workforce distribution across company departments.
- Weekly attendance presence trends.
- Quick action queues for pending approvals.

---

## Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Lucide React icons
- **Routing**: React Router v6
- **HTTP Client**: Axios with JWT interceptors
- **Data Visualization**: Recharts

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript (with `tsx`)
- **Authentication**: JWT (JSON Web Tokens) & `bcryptjs`
- **Validation**: Zod schema validation
- **Database Driver**: `mysql2` with automatic database initialization and built-in fallback resilience.

### Database
- **Primary Engine**: MySQL 8.0+
- Relational schema with primary keys, foreign key constraints, indexes, and cascades.

---

## Application Structure

```text
dayflow/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Button, Input, Modal, Badge, StatCard, EmptyState, LoadingSpinner
│   │   │   └── layout/         # Header, Sidebar, ProtectedRoute
│   │   ├── pages/
│   │   │   ├── auth/           # Login, Register, ForgotPassword
│   │   │   ├── employee/       # EmployeeDashboard, MyProfile, MyAttendance, MyLeaves, MyPayroll
│   │   │   ├── admin/          # AdminDashboard, EmployeeList, EmployeeDetails, AdminAttendance, LeaveApprovals, AdminPayroll
│   │   │   └── common/         # NotificationsPage, SettingsPage, NotFoundPage
│   │   ├── layouts/            # DashboardLayout
│   │   ├── services/           # api, authService, employeeService, attendanceService, leaveService, payrollService, notificationService, statsService
│   │   ├── context/            # AuthContext, ToastContext
│   │   ├── hooks/              # useAuth, useToast
│   │   ├── types/              # index.ts (Full TypeScript data definitions)
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/             # db.ts (MySQL pool & fallback), env.ts
│   │   ├── controllers/        # auth, employee, attendance, leave, payroll, notification, stats
│   │   ├── middleware/         # authMiddleware, roleMiddleware, errorHandler
│   │   ├── models/             # userModel, employeeModel, attendanceModel, leaveModel, payrollModel, notificationModel
│   │   ├── routes/             # authRoutes, employeeRoutes, attendanceRoutes, leaveRoutes, payrollRoutes, notificationRoutes, statsRoutes
│   │   ├── utils/              # jwt, password, response, seedData
│   │   └── server.ts           # Express server entry point
│   ├── tsconfig.json
│   └── package.json
│
├── database/
│   ├── schema.sql              # MySQL DDL relational table schema
│   └── seed.sql                # Initial development seed data
│
├── .env.example
└── README.md
```

---

## Demo Credentials

You can log in with these pre-seeded development accounts or click the **One-Click Demo Credentials** buttons on the login screen:

### 1. Admin / HR Officer Account
- **Email**: `admin@dayflow.com`
- **Password**: `Admin@123`
- **Role**: `ADMIN`

### 2. Employee Account
- **Email**: `employee@dayflow.com`
- **Password**: `Employee@123`
- **Role**: `EMPLOYEE`

---

## Installation & Setup

### Prerequisites
- Node.js (v18.0.0 or later)
- npm / yarn / pnpm
- MySQL Server (optional for native MySQL storage; embedded mode works out of the box)

### 1. Configure Environment Variables
Copy `.env.example` to `.env` in the root:
```bash
cp .env.example .env
```

Default contents:
```env
PORT=5000
NODE_ENV=development

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=dayflow_db

# Security & JWT
JWT_SECRET=dayflow_super_secure_jwt_secret_key_2026_aligned
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

---

## Database Configuration (MySQL)

If you have a local MySQL server running:
1. Log into your MySQL client:
   ```bash
   mysql -u root -p
   ```
2. Execute the schema and seed scripts:
   ```sql
   source database/schema.sql;
   source database/seed.sql;
   ```
*Note: If MySQL is not running on port 3306, the backend automatically initializes with embedded relational data so you can test all features immediately without any manual configuration.*

---

## Running the Application

### 1. Start the Backend Server
```bash
cd backend
npm install
npm run dev
```
The backend REST API will start at `http://localhost:5000`.

### 2. Start the Frontend Application
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```
The frontend application will start at `http://localhost:5173`.

---

## API Overview

### Authentication
- `POST /api/auth/register` — Register a new employee or admin account.
- `POST /api/auth/login` — Authenticate and receive a JWT.
- `POST /api/auth/logout` — End user session.
- `GET /api/auth/me` — Retrieve active user session and profile.

### Employees
- `GET /api/employees` — List all workforce employees (Admin/Directory).
- `GET /api/employees/:id` — Retrieve full employee profile with compensation.
- `POST /api/employees` — Onboard a new employee (Admin).
- `PUT /api/employees/:id` — Update employee details (Role-guarded).
- `DELETE /api/employees/:id` — Deactivate employee profile (Admin).

### Attendance
- `POST /api/attendance/check-in` — Clock in for the current workday.
- `POST /api/attendance/check-out` — Clock out and compute working hours.
- `GET /api/attendance/my` — Retrieve employee's personal attendance history.
- `GET /api/attendance` — View all company attendance logs (Admin).
- `PUT /api/attendance/:id` — Manually adjust punches/status (Admin).

### Leaves
- `POST /api/leaves` — Submit a new leave application.
- `GET /api/leaves/my` — View leave requests and quota balances.
- `GET /api/leaves` — Retrieve all company leave requests (Admin).
- `PUT /api/leaves/:id/approve` — Approve leave with optional notes (Admin).
- `PUT /api/leaves/:id/reject` — Reject leave with comments (Admin).

### Payroll
- `GET /api/payroll/my` — Securely view own compensation breakdown.
- `GET /api/payroll` — View company payroll register (Admin).
- `PUT /api/payroll/:id` — Update basic salary, allowances, deductions (Admin).

### Notifications
- `GET /api/notifications` — Retrieve user alerts.
- `PUT /api/notifications/:id/read` — Mark notification as read.
- `PUT /api/notifications/read-all` — Mark all notifications as read.

---

## Future Enhancements
- Automated Email & SMS Notifications via SendGrid/Twilio.
- PDF Salary Slip Generation and Download.
- Biometric & Facial Recognition Device Integration.
- Performance Review Cycles and 360-Degree Feedback.
- AI-Powered Workforce Analytics & Attrition Prediction.
