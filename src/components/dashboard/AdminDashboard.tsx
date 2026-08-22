import React from 'react';
import {
  Users,
  Clock,
  Calendar,
  DollarSign,
  UserCheck,
  UserX,
  Plane,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import type { EmployeeProfile, LeaveRequest, AttendanceRecord } from '../../types';

interface AdminDashboardProps {
  employees: EmployeeProfile[];
  leaveRequests: LeaveRequest[];
  attendance: AttendanceRecord[];
  setActiveTab: (tab: string) => void;
  onSelectEmployee: (emp: EmployeeProfile) => void;
  isAdmin: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  employees,
  leaveRequests,
  setActiveTab,
  onSelectEmployee,
}) => {
  const totalEmployees = employees.length;
  const presentCount = employees.filter((e) => e.status === 'present').length;
  const absentCount = employees.filter((e) => e.status === 'absent').length;
  const leaveCount = employees.filter((e) => e.status === 'leave').length;
  const pendingLeaves = leaveRequests.filter((r) => r.status === 'Pending');

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#161b22] border border-[#30363d] p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300 border border-purple-500/30 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-purple-300" />
              Dayflow Intelligence Overview
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Workforce Operations Hub
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-2xl">
              Real-time employee monitoring, automated attendance tracking, leave requests workflow, and payroll breakdown.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('employees')}
              className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-purple-500 transition-all active:scale-95"
            >
              <Users className="h-4 w-4" />
              Manage Workforce
            </button>
            <button
              onClick={() => setActiveTab('timeoff')}
              className="flex items-center gap-2 rounded-xl bg-[#21262d] border border-[#30363d] px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-[#30363d] transition-all active:scale-95"
            >
              <Calendar className="h-4 w-4 text-cyan-400" />
              Review Leave ({pendingLeaves.length})
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Employees */}
        <div
          onClick={() => setActiveTab('employees')}
          className="solid-card cursor-pointer rounded-2xl p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Workforce</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-white">{totalEmployees}</p>
          <p className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="h-3 w-3" /> Active Personnel
          </p>
        </div>

        {/* Present Today */}
        <div
          onClick={() => setActiveTab('attendance')}
          className="solid-card cursor-pointer rounded-2xl p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Present Today</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <UserCheck className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-emerald-400">{presentCount}</p>
          <p className="mt-1 text-[11px] text-slate-400 font-medium">
            {totalEmployees > 0 ? Math.round((presentCount / totalEmployees) * 100) : 0}% Attendance Rate
          </p>
        </div>

        {/* Absent Today */}
        <div
          onClick={() => setActiveTab('attendance')}
          className="solid-card cursor-pointer rounded-2xl p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Absent Today</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <UserX className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-amber-400">{absentCount}</p>
          <p className="mt-1 text-[11px] text-slate-400">Unexcused or Out</p>
        </div>

        {/* On Leave */}
        <div
          onClick={() => setActiveTab('timeoff')}
          className="solid-card cursor-pointer rounded-2xl p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">On Leave</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <Plane className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-cyan-400">{leaveCount}</p>
          <p className="mt-1 text-[11px] text-slate-400">Approved PTO & Sick</p>
        </div>

        {/* Pending Requests */}
        <div
          onClick={() => setActiveTab('timeoff')}
          className="solid-card cursor-pointer rounded-2xl p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Pending Requests</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-rose-400">{pendingLeaves.length}</p>
          <p className="mt-1 text-[11px] text-rose-300 font-medium">Action Required</p>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 columns: Workforce Directory Preview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-400" />
              Employee Roster & Status
            </h2>
            <button
              onClick={() => setActiveTab('employees')}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              View All ({employees.length}) <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {employees.slice(0, 4).map((emp) => (
              <div
                key={emp.id}
                onClick={() => onSelectEmployee(emp)}
                className="solid-card cursor-pointer rounded-2xl p-4 flex items-center gap-4 group"
              >
                <div className="relative shrink-0">
                  <img
                    src={emp.avatarUrl}
                    alt={emp.name}
                    className="h-12 w-12 rounded-2xl object-cover ring-2 ring-slate-700 group-hover:ring-purple-500 transition-all"
                  />
                  <span
                    className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full ring-2 ring-[#0d1117] ${
                      emp.status === 'present'
                        ? 'bg-emerald-500'
                        : emp.status === 'absent'
                        ? 'bg-amber-500'
                        : 'bg-cyan-500'
                    }`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                      {emp.name}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400 bg-[#0d1117] px-2 py-0.5 rounded border border-[#30363d]">
                      {emp.loginId || emp.employeeId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{emp.jobPosition}</p>
                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 truncate">{emp.department}</span>
                    <span
                      className={`font-semibold capitalize ${
                        emp.status === 'present'
                          ? 'text-emerald-400'
                          : emp.status === 'absent'
                          ? 'text-amber-400'
                          : 'text-cyan-400'
                      }`}
                    >
                      {emp.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Quick Shortcuts & Pending Requests */}
        <div className="space-y-6">
          {/* Quick Access Actions */}
          <div className="rounded-2xl bg-[#161b22] border border-[#30363d] p-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400">
              Quick Shortcuts
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setActiveTab('employees')}
                className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-[#0d1117] border border-[#30363d] hover:border-purple-500/50 hover:bg-[#21262d] text-slate-200 transition-all text-center group"
              >
                <Users className="h-6 w-6 text-purple-400 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-xs font-medium">Employees</span>
              </button>

              <button
                onClick={() => setActiveTab('attendance')}
                className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-[#0d1117] border border-[#30363d] hover:border-emerald-500/50 hover:bg-[#21262d] text-slate-200 transition-all text-center group"
              >
                <Clock className="h-6 w-6 text-emerald-400 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-xs font-medium">Attendance</span>
              </button>

              <button
                onClick={() => setActiveTab('timeoff')}
                className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-[#0d1117] border border-[#30363d] hover:border-cyan-500/50 hover:bg-[#21262d] text-slate-200 transition-all text-center group"
              >
                <Calendar className="h-6 w-6 text-cyan-400 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-xs font-medium">Time Off</span>
              </button>

              <button
                onClick={() => setActiveTab('salary')}
                className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-[#0d1117] border border-[#30363d] hover:border-indigo-500/50 hover:bg-[#21262d] text-slate-200 transition-all text-center group"
              >
                <DollarSign className="h-6 w-6 text-indigo-400 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-xs font-medium">Salary / Payroll</span>
              </button>
            </div>
          </div>

          {/* Pending Approvals Widget */}
          <div className="rounded-2xl bg-[#161b22] border border-[#30363d] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="h-4 w-4 text-cyan-400" />
                Pending Leave Queue
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                {pendingLeaves.length}
              </span>
            </div>

            {pendingLeaves.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">No pending leave requests.</p>
            ) : (
              <div className="space-y-3">
                {pendingLeaves.slice(0, 3).map((req) => (
                  <div
                    key={req.id}
                    className="p-3 rounded-xl bg-[#0d1117] border border-[#30363d] flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-white">{req.employeeName}</p>
                      <p className="text-slate-400">{req.leaveType} ({req.numberOfDays} Days)</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('timeoff')}
                      className="px-2.5 py-1 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-500 transition-colors"
                    >
                      Review
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
