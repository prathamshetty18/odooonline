# ⚡ Dayflow HRMS — Enterprise Human Resource Management System

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-brightgreen?style=for-the-badge&logo=vercel)](https://dayflow-hrms-nine.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/prathamshetty18/odooonline)
[![React](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4.0-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Supported-emerald?style=for-the-badge&logo=supabase)](https://supabase.com)

**Dayflow** is a modern, responsive, dark-themed **Human Resource Management System (HRMS)** built based on official wireframe specifications. It delivers a complete HR & Employee experience featuring role-based access control, auto-generated Login IDs, real-time attendance clocking, leave approval workflows, and an interactive salary/payroll engine with printable payslips.

---

## 🔗 Live Application & Repository

- **🌐 Live Production App**: [https://dayflow-hrms-nine.vercel.app](https://dayflow-hrms-nine.vercel.app)
- **Octocat GitHub Repository**: [https://github.com/prathamshetty18/odooonline](https://github.com/prathamshetty18/odooonline)

---

## 🔑 Demo Login Credentials

Try out the application using pre-configured Indian workforce accounts or create your own:

| Role | Name | Designation | Login ID / Email | Password |
| :--- | :--- | :--- | :--- | :--- |
| **Admin / HR** | Aarav Mehta | HR Manager | `DFAAME20260001` *(or admin@dayflow.com)* | `admin123` |
| **Employee** | Priya Sharma | Lead UI/UX Architect | `DFPRSH20260002` *(or priya.sharma@dayflow.com)* | `emp123` |
| **Employee** | Rohan Verma | Senior Full Stack Eng | `DFROVE20260003` *(or rohan.verma@dayflow.com)* | `emp123` |
| **Employee** | Ananya Deshmukh | HR Business Partner | `DFANDE20260004` *(or ananya.deshmukh@dayflow.com)* | `emp123` |
| **Employee** | Vikram Patel | Financial Analyst | `DFVIPA20260005` *(or vikram.patel@dayflow.com)* | `emp123` |
| **Employee** | Kavya Nair | Growth Marketing Mgr | `DFKANA20260006` *(or kavya.nair@dayflow.com)* | `emp123` |

---

## ✨ Core Features

### 1. 🔐 Authentication & Sign Up
- **Wireframe Login ID Generator**: Automatically generates IDs in the format:  
  `[Company 2-letter Prefix][First 2 letters of First & Last Name][Year][Serial 4-digits]`  
  *Example*: **Dayflow** + **Priya Sharma** + **2026** + **0002** → `DFPRSH20260002`.
- **Sign Up Form**: Register new Company & Staff accounts with Designation / Post selection (`HR Manager`, `Software Engineer`, `UI/UX Designer`, `Manager`, etc.).
- **Dual Login Support**: Sign in using either **Email** or **Login ID**.

### 2. 🛡️ Role-Based Access Control
- **Admin / HR View**:
  - Full Company Dashboard with live KPI counters (Total Workforce, Present, Absent, On Leave, Pending Requests).
  - Employee Directory management & Add New Employee modal.
  - Leave Approval Hub (Approve & Reject with custom reasoning).
  - Payroll & Salary Structure Editor.
- **Employee View**:
  - Clean, distraction-free view with access strictly restricted to personal data (**My Profile**, **My Attendance**, **My Leave**, **My Salary**).
  - No access to other employees' private data or company-wide dashboards.

### 3. ⏱️ Time & Attendance
- Live punch clock with **Check In** and **Check Out** buttons.
- Real-time work hours and overtime (extra hours) calculator.
- Date-filterable attendance history log with status badges.

### 4. 🌴 Leave & Time Off Management
- Live entitlement balance trackers (Paid Time Off, Sick Leave, Unpaid Leave).
- Apply for leave with start/end date pickers, auto day count calculation, and medical certificate upload.
- Admin approval & rejection workflow.

### 5. 💰 Salary & Payroll Engine
- Dynamic percentage-based component breakdown (Basic 50%, HRA 50% of Basic, Standard Allowance, Bonus, LTA, Fixed Allowance, PF 12% of Basic, Professional Tax).
- Admin live slider adjustment modal with real-time recalculation preview.
- **Printable Payslip Modal** to view and print official salary slips.

---

## 🛠️ Localhost Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or higher)
- `npm`

### Step-by-Step Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/prathamshetty18/odooonline.git
   cd odooonline
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **View in Browser**:
   Navigate to `http://localhost:5173`

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🗄️ Supabase Database Integration (Optional)

Dayflow includes built-in support for **Supabase (PostgreSQL)** with an automatic fallback to local storage if no database URL is set up.

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase Dashboard and run the script in [`supabase/schema.sql`](./supabase/schema.sql).
3. Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Restart `npm run dev`.

---

## 🚀 Deployment to Vercel

The repository includes a `vercel.json` file configured for Vite single-page applications.

To deploy via Vercel CLI:
```bash
npx vercel --prod
```

Or connect the GitHub repository `prathamshetty18/odooonline` directly in the [Vercel Dashboard](https://vercel.com/new).

---

## 📄 License

MIT License © 2026 Dayflow HRMS
