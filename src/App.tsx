import { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { LoginModal } from './components/auth/LoginModal';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { EmployeeDirectory } from './components/employees/EmployeeDirectory';
import { EmployeeProfileView } from './components/employees/EmployeeProfileView';
import { AttendanceView } from './components/attendance/AttendanceView';
import { TimeOffView } from './components/leave/TimeOffView';
import { SalaryManagementView } from './components/salary/SalaryManagementView';

import type { User, EmployeeProfile, AttendanceRecord, LeaveRequest } from './types';
import { db } from './services/db';

export function App() {
  // Always start on login screen (null currentUser)
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeProfile | null>(null);

  // State synchronized with DB
  const [employees, setEmployees] = useState<EmployeeProfile[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);

  // Refresh DB data
  const refreshData = () => {
    setEmployees(db.getEmployees());
    setAttendance(db.getAttendance());
    setLeaveRequests(db.getLeaveRequests());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setActiveTab('dashboard');
      setSelectedEmployee(null);
    } else {
      // Normal employee: land on Profile, do not show Dashboard or Employee Directory
      const myEmp = db.getEmployeeById(user.employeeId);
      if (myEmp) {
        setSelectedEmployee(myEmp);
      }
      setActiveTab('profile');
    }
  };

  const handleSelectEmployee = (emp: EmployeeProfile) => {
    setSelectedEmployee(emp);
    setActiveTab('profile');
  };

  const handleSelectMyProfile = () => {
    if (currentUser) {
      const myEmp = db.getEmployeeById(currentUser.employeeId);
      if (myEmp) {
        setSelectedEmployee(myEmp);
        setActiveTab('profile');
      }
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] selection:bg-purple-600 selection:text-white flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (!isAdmin && (tab === 'dashboard' || tab === 'employees')) {
            handleSelectMyProfile();
          } else {
            if (tab !== 'profile') setSelectedEmployee(null);
            setActiveTab(tab);
          }
        }}
        onLogout={() => {
          setCurrentUser(null);
          setSelectedEmployee(null);
          setActiveTab('dashboard');
        }}
        onSelectMyProfile={handleSelectMyProfile}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!currentUser ? (
          <LoginModal onLoginSuccess={handleLoginSuccess} />
        ) : (
          <>
            {/* Dashboard (Admin Only) */}
            {activeTab === 'dashboard' && isAdmin && (
              <AdminDashboard
                employees={employees}
                leaveRequests={leaveRequests}
                attendance={attendance}
                setActiveTab={(tab) => {
                  setSelectedEmployee(null);
                  setActiveTab(tab);
                }}
                onSelectEmployee={handleSelectEmployee}
                isAdmin={isAdmin}
              />
            )}

            {/* Employees Directory (Admin Only) */}
            {activeTab === 'employees' && isAdmin && (
              <EmployeeDirectory
                employees={employees}
                onSelectEmployee={handleSelectEmployee}
                onEmployeeAdded={() => refreshData()}
                isAdmin={isAdmin}
              />
            )}

            {/* Profile View (Accessible by Admin for any employee, or by Employee for self) */}
            {activeTab === 'profile' && (selectedEmployee || (currentUser && db.getEmployeeById(currentUser.employeeId))) && (
              <EmployeeProfileView
                employee={selectedEmployee || db.getEmployeeById(currentUser.employeeId)!}
                currentUser={currentUser}
                onBack={() => setActiveTab(isAdmin ? 'employees' : 'profile')}
                onProfileUpdated={(updated) => {
                  setSelectedEmployee(updated);
                  refreshData();
                }}
              />
            )}

            {/* Attendance View */}
            {activeTab === 'attendance' && (
              <AttendanceView
                currentUser={currentUser}
                employees={employees}
                attendanceRecords={attendance}
                onAttendanceUpdated={() => refreshData()}
                isAdmin={isAdmin}
              />
            )}

            {/* Time Off / Leave View */}
            {activeTab === 'timeoff' && (
              <TimeOffView
                currentUser={currentUser}
                leaveRequests={leaveRequests}
                employees={employees}
                onLeaveUpdated={() => refreshData()}
                isAdmin={isAdmin}
              />
            )}

            {/* Salary View */}
            {activeTab === 'salary' && (
              <SalaryManagementView
                currentUser={currentUser}
                employees={employees}
                onSalaryUpdated={() => refreshData()}
                isAdmin={isAdmin}
              />
            )}
          </>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="border-t border-[#30363d] py-6 text-center text-xs text-slate-500 bg-[#0d1117]">
        <p>Dayflow Human Resource Management System v2.5 • Enterprise Professional Edition</p>
      </footer>
    </div>
  );
}

export default App;
