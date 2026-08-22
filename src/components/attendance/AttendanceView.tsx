import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  LogOut as LogOutIcon,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { AttendanceRecord, EmployeeProfile, User } from '../../types';
import { db } from '../../services/db';

interface AttendanceViewProps {
  currentUser: User;
  employees: EmployeeProfile[];
  attendanceRecords: AttendanceRecord[];
  onAttendanceUpdated: () => void;
  isAdmin: boolean;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  currentUser,
  employees,
  attendanceRecords,
  onAttendanceUpdated,
  isAdmin,
}) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('all');
  const [searchDate, setSearchDate] = useState<string>('');

  const userEmployee = employees.find((e) => e.employeeId === currentUser.employeeId);
  const todayRecord = userEmployee ? db.getTodayRecord(userEmployee.employeeId) : undefined;

  const isCheckedIn = todayRecord && todayRecord.checkIn !== '-';
  const isCheckedOut = todayRecord && todayRecord.checkOut && todayRecord.checkOut !== '-';

  // Handle Check In
  const handleCheckIn = () => {
    if (!userEmployee) return;
    db.checkIn(userEmployee.employeeId, userEmployee.name);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    onAttendanceUpdated();
  };

  // Handle Check Out
  const handleCheckOut = () => {
    if (!userEmployee) return;
    db.checkOut(userEmployee.employeeId);
    onAttendanceUpdated();
  };

  // Metrics for employee view
  const myRecords = attendanceRecords.filter((r) => r.employeeId === currentUser.employeeId);
  const daysPresent = myRecords.filter((r) => r.status === 'present').length;
  const leaveCount = myRecords.filter((r) => r.status === 'leave').length;
  const totalWorkingDays = 22; // Monthly baseline

  // Filtered attendance for admin or user
  const displayRecords = attendanceRecords.filter((r) => {
    const matchesEmp =
      selectedEmployeeId === 'all' ||
      r.employeeId === selectedEmployeeId ||
      r.employeeName.toLowerCase().includes(selectedEmployeeId.toLowerCase());
    const matchesDate = !searchDate || r.date === searchDate;
    return matchesEmp && matchesDate;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Time & Attendance Hub</h1>
          <p className="text-xs text-slate-400">
            Real-time daily punch clock, hours calculation, and workforce attendance logs
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-medium text-purple-300 bg-purple-950/60 border border-purple-800 px-3.5 py-1.5 rounded-full shrink-0">
          <Clock className="h-4 w-4 text-purple-400 animate-pulse" />
          Today: {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* Employee Interactive Check-In Banner */}
      {!isAdmin && userEmployee && (
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/30">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                {isCheckedOut
                  ? 'Punch Status: Shift Completed'
                  : isCheckedIn
                  ? 'Punch Status: Currently Present & Logged In'
                  : 'Punch Status: Not Checked In Yet'}
              </div>
              <h2 className="text-xl font-bold text-white">Daily Punch Controls</h2>
              <p className="text-xs text-slate-400 max-w-md">
                Log your start and end times to calculate work duration and overtime extra hours.
              </p>
            </div>

            {/* Check-In / Check-Out Buttons */}
            <div className="flex items-center gap-4">
              {!isCheckedIn ? (
                <button
                  onClick={handleCheckIn}
                  className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-emerald-950/50 hover:from-emerald-400 hover:to-teal-500 transition-all active:scale-95 glow-purple"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  Check In Now
                </button>
              ) : !isCheckedOut ? (
                <button
                  onClick={handleCheckOut}
                  className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-rose-950/50 hover:from-rose-500 hover:to-amber-500 transition-all active:scale-95"
                >
                  <LogOutIcon className="h-5 w-5" />
                  Check Out Shift
                </button>
              ) : (
                <div className="px-5 py-3 rounded-2xl bg-slate-950 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> Shift Completed ({todayRecord?.workHours || 8} hrs)
                </div>
              )}
            </div>
          </div>

          {/* Current Punch Summary Card */}
          {isCheckedIn && (
            <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400">Check In Time</span>
                <p className="text-sm font-bold font-mono text-emerald-400 mt-0.5">{todayRecord?.checkIn}</p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400">Check Out Time</span>
                <p className="text-sm font-bold font-mono text-amber-400 mt-0.5">{todayRecord?.checkOut || 'In Progress...'}</p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400">Work Hours</span>
                <p className="text-sm font-bold font-mono text-purple-400 mt-0.5">{todayRecord?.workHours || 0} hrs</p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400">Extra Hours</span>
                <p className="text-sm font-bold font-mono text-cyan-400 mt-0.5">{todayRecord?.extraHours || 0} hrs</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Employee Attendance Metrics */}
      {!isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Days Present (This Month)</span>
            <p className="mt-2 text-2xl font-bold text-emerald-400">{daysPresent} Days</p>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Leaves Taken</span>
            <p className="mt-2 text-2xl font-bold text-cyan-400">{leaveCount} Days</p>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Total Working Days</span>
            <p className="mt-2 text-2xl font-bold text-purple-400">{totalWorkingDays} Days</p>
          </div>
        </div>
      )}

      {/* Admin Filters */}
      {isAdmin && (
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              className="rounded-xl bg-slate-950 border border-slate-800 py-2 px-3 text-xs text-slate-200 focus:outline-none"
            >
              <option value="all">All Employees ({employees.length})</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.employeeId}>
                  {emp.name} ({emp.employeeId})
                </option>
              ))}
            </select>

            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="rounded-xl bg-slate-950 border border-slate-800 py-2 px-3 text-xs text-slate-200 focus:outline-none"
            />
          </div>

          <span className="text-xs font-mono text-slate-400">
            Showing {displayRecords.length} Attendance Logs
          </span>
        </div>
      )}

      {/* Attendance Log Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple-400" /> Attendance Log History
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Employee</th>
                <th className="py-3.5 px-6">Check In</th>
                <th className="py-3.5 px-6">Check Out</th>
                <th className="py-3.5 px-6">Work Hours</th>
                <th className="py-3.5 px-6">Extra Hours</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {displayRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                    No attendance logs found matching the filter.
                  </td>
                </tr>
              ) : (
                displayRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-6 font-mono text-slate-300 font-semibold">{rec.date}</td>
                    <td className="py-3.5 px-6 font-bold text-white">{rec.employeeName}</td>
                    <td className="py-3.5 px-6 font-mono text-emerald-400">{rec.checkIn}</td>
                    <td className="py-3.5 px-6 font-mono text-amber-400">{rec.checkOut || '-'}</td>
                    <td className="py-3.5 px-6 font-mono font-bold text-purple-300">{rec.workHours} hrs</td>
                    <td className="py-3.5 px-6 font-mono text-cyan-400">{rec.extraHours} hrs</td>
                    <td className="py-3.5 px-6">
                      <span
                        className={
                          rec.status === 'present'
                            ? 'badge-present'
                            : rec.status === 'absent'
                            ? 'badge-absent'
                            : 'badge-leave'
                        }
                      >
                        {rec.status === 'present' && '🟢 Present'}
                        {rec.status === 'absent' && '🟡 Absent'}
                        {rec.status === 'leave' && '🔵 On Leave'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
