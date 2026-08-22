# Dayflow HRMS - Human Resource Management System

Dayflow is a modern, responsive, dark-themed **Human Resource Management System (HRMS)** built with React, TypeScript, Vite, and Tailwind CSS. It is designed based on official HRMS wireframes and follows best practices for accessibility and responsive design.

---

## 🌟 Key Features

- **Authentication & Sign Up**:
  - **Sign In**: Login using Email or Auto-Generated Login ID.
  - **Sign Up**: Register new Company & Admin accounts.
  - **Wireframe Login ID Generator**: Automatically generates IDs in the format `[Company 2-letter Prefix][First 2 letters of First & Last Name][Year][Serial 4-digits]` (e.g. `DFPRSH20260002`).

- **Workforce Directory**:
  - Clickable employee cards displaying avatar, name, ID, job position, location, and real-time attendance status (🟢 Present, 🟡 Absent, 🔵 On Leave).
  - Search by name, ID, position, and filter by status/department.
  - Admin modal to create new employees with auto-assigned Login IDs.

- **Employee Profiles (4 Tabs)**:
  - **Resume**: Professional bio, skill chips (with add/remove tag controls), certifications.
  - **Private Info**: Confidential personal, bank account, IFSC, PAN, and UAN details.
  - **Salary Info**: Wage breakdown, percentage/fixed component math, PF & Tax deductions, Net Take-Home pay.
  - **Security**: Account password change form with current password verification.

- **Time & Attendance**:
  - Daily punch clock with **Check In** and **Check Out** buttons.
  - Automatic work hours & overtime extra hours calculation.
  - Attendance history log with date/employee filtering.

- **Time Off / Leave Management**:
  - Leave entitlement balances (Paid Time Off, Sick Leave, Unpaid Leave).
  - Apply for leave with start/end date pickers, auto day count calculation, remarks, and medical certificate upload.
  - **Admin Approval Hub**: One-click approval or rejection with mandatory rejection reasoning.

- **Salary & Payroll**:
  - Dynamic salary structure calculator (Basic 50%, HRA 50% of Basic, Standard Allowance, Bonus, LTA, Fixed Allowance, PF 12% of Basic, Tax).
  - Admin Edit Salary modal with live sliders.
  - **Printable Payslip Modal** for printing or saving salary slips as PDF.

---

## 🚀 How to Run on Localhost

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` (comes bundled with Node.js)

### Installation & Launch Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/prathamshetty18/odooonline.git
   cd odooonline
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Local Development Server**:
   ```bash
   npm run dev
   ```

4. **Access the App**:
   Open your browser and navigate to:
   [http://localhost:5173](http://localhost:5173)

---

## 🔑 Pre-Populated Test Demo Credentials

You can test both **Admin/HR** and **Employee** roles using the one-click demo buttons on the Sign In screen or using the credentials below:

| Role | Name | Login ID / Email | Password |
| :--- | :--- | :--- | :--- |
| **Admin / HR** | Aarav Mehta | `DFAAME20260001` (or `admin@dayflow.com`) | `admin123` |
| **Employee (Lead UX)** | Priya Sharma | `DFPRSH20260002` (or `priya.sharma@dayflow.com`) | `emp123` |
| **Employee (Senior Dev)** | Rohan Verma | `DFROVE20260003` (or `rohan.verma@dayflow.com`) | `emp123` |
| **Employee (HR Partner)** | Ananya Deshmukh | `DFANDE20260004` (or `ananya.deshmukh@dayflow.com`) | `emp123` |

---

## 🛠️ Built With

- **React 19** & **TypeScript**
- **Vite** (Build Tool)
- **Tailwind CSS** (Styling)
- **Lucide React** (Icons)
- **Canvas Confetti** (Animations)
