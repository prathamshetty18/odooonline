# Dayflow — Human Resource Management System

> **Every workday, perfectly aligned.**

Dayflow is a **Human Resource Management System (HRMS)** designed to digitize and streamline essential HR operations. It provides employees and HR/Admin officers with a centralized platform for managing profiles, attendance, leave requests, payroll information, and approval workflows.

## 🚀 Features

### 🔐 Authentication & Authorization

* Secure Sign Up and Sign In
* Employee ID, email, password, and role-based registration
* Email verification
* Role-based access control
* Separate Employee and Admin/HR experiences

### 👨‍💼 Employee Management

Employees can:

* View personal information
* View job details
* View salary structure
* Access documents
* Manage profile picture
* Update limited profile information such as phone number and address

Admins/HR can:

* View employee information
* Switch between employees
* Edit employee details

### 📊 Attendance Management

* Daily attendance tracking
* Weekly attendance view
* Employee check-in/check-out
* Attendance status:

  * Present
  * Absent
  * Half-day
  * Leave
* Employees can view their own attendance
* Admin/HR can view attendance records of all employees

### 📝 Leave & Time-Off Management

Employees can:

* Apply for leave
* Select leave type:

  * Paid
  * Sick
  * Unpaid
* Select date ranges
* Add remarks
* Track request status

Leave statuses:

* 🟡 Pending
* 🟢 Approved
* 🔴 Rejected

Admins/HR can:

* View all leave requests
* Approve or reject requests
* Add comments
* Update employee records automatically after decisions

### 💰 Payroll & Salary Management

Employees have read-only access to their payroll information.

Admins can:

* View payroll information of all employees
* Update salary structures
* Maintain payroll accuracy

### 📈 Dashboard

#### Employee Dashboard

Provides quick access to:

* Profile
* Attendance
* Leave Requests
* Logout
* Recent activities and alerts

#### Admin/HR Dashboard

Provides:

* Employee list
* Attendance records
* Leave approvals
* Employee switching
* Payroll information

## 🏗️ System Roles

| Role                   | Capabilities                                              |
| ---------------------- | --------------------------------------------------------- |
| **Employee**           | Profile, attendance, leave requests, salary details       |
| **Admin / HR Officer** | Employee management, attendance, leave approvals, payroll |

## 🔄 Core Workflow

```text
                    ┌─────────────────┐
                    │      Login      │
                    └────────┬────────┘
                             │
                   ┌─────────▼─────────┐
                   │  Role Validation  │
                   └─────────┬─────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
       ┌──────▼───────┐              ┌──────▼───────┐
       │   Employee   │              │  Admin / HR  │
       └──────┬───────┘              └──────┬───────┘
              │                             │
       ┌──────▼────────┐             ┌──────▼────────┐
       │   Dashboard   │             │   Dashboard   │
       └──────┬────────┘             └──────┬────────┘
              │                             │
       ┌──────┼──────────┐          ┌───────┼─────────┐
       │      │          │          │       │         │
    Profile Attendance Leave     Employees Attendance Payroll
                      │              │       │
                      └──────► Approval ◄────┘
```

## 📌 Functional Modules

```text
Dayflow HRMS
│
├── Authentication
│   ├── Sign Up
│   ├── Sign In
│   └── Email Verification
│
├── Employee Management
│   ├── Profile
│   ├── Job Details
│   ├── Documents
│   └── Salary Structure
│
├── Attendance
│   ├── Check-in / Check-out
│   ├── Daily View
│   ├── Weekly View
│   └── Attendance Status
│
├── Leave Management
│   ├── Apply Leave
│   ├── Leave Types
│   ├── Approval
│   └── Request Status
│
└── Payroll
    ├── Employee Payroll View
    ├── Salary Structure
    └── Admin Payroll Control
```

## 🛡️ Access Control

Dayflow follows a **role-based access model**:

### Employee

Employees have access to their own:

* Profile
* Attendance
* Leave requests
* Salary information

### Admin / HR Officer

Admins/HR have management privileges over:

* Employees
* Attendance
* Leave approvals
* Payroll
* Salary structures

## 🔮 Future Enhancements

The project specification identifies the following future improvements:

* 📧 Email and notification alerts
* 📊 Analytics and reporting dashboard
* 📄 Salary slip reports
* 📈 Attendance reports

## 🎯 Project Objective

The main objective of Dayflow is to replace fragmented HR processes with a **centralized digital HR management platform**, making everyday HR operations easier for both employees and HR/Admin teams.

## 🗂️ Project Structure

A suggested repository structure:

```text
dayflow/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── assets/
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── services/
│   └── middleware/
│
├── database/
│   └── schema/
│
├── docs/
│   └── requirements/
│
├── README.md
└── LICENSE
```

> **Note:** The uploaded project specification defines the HRMS requirements and functionality, but does not specify a finalized programming language, framework, database, or exact repository structure. The structure above is therefore a suggested organization rather than a source-defined implementation.

## 📐 Requirements Reference

The system requirements cover:

* Authentication & authorization
* Role-based access
* Employee profiles
* Attendance tracking
* Leave management
* Approval workflows
* Payroll visibility and control
* Notifications
* Analytics and reports

The complete functional requirements are defined in the project specification.

## 👥 User Types

| User                         | Description                                                               |
| ---------------------------- | ------------------------------------------------------------------------- |
| 👨‍💼 **Admin / HR Officer** | Manages employees, attendance, leave approvals, and payroll               |
| 👤 **Employee**              | Manages personal information, attendance, leave, and views salary details |

## 📚 Project Documentation

The project includes an Excalidraw architecture/design reference:

**Excalidraw:** https://link.excalidraw.com/l/65VNwvy7c4X/58RLEJ4oOwh

## 📄 License

This project is intended for educational/project development purposes. Add an appropriate open-source license if the repository is intended for public distribution.

---

### ⭐ Dayflow

**Every workday, perfectly aligned.**

A centralized HRMS for simplifying **people, attendance, leave, and payroll management**.
