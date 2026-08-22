import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Paperclip,
  Check,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { LeaveRequest, User, EmployeeProfile } from '../../types';
import { db } from '../../services/db';
import { ApplyLeaveModal } from './ApplyLeaveModal';
import { RejectLeaveModal } from './RejectLeaveModal';

interface TimeOffViewProps {
  currentUser: User;
  leaveRequests: LeaveRequest[];
  employees: EmployeeProfile[];
  onLeaveUpdated: () => void;
  isAdmin: boolean;
}

export const TimeOffView: React.FC<TimeOffViewProps> = ({
  currentUser,
  leaveRequests,
  employees,
  onLeaveUpdated,
  isAdmin,
}) => {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [rejectingRequest, setRejectingRequest] = useState<LeaveRequest | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');

  const myEmployee = employees.find((e) => e.employeeId === currentUser.employeeId);
  const leaveBalance = myEmployee
    ? db.getLeaveBalance(myEmployee.employeeId)
    : {
        paidTimeOff: { total: 18, used: 3 },
        sickLeave: { total: 12, used: 1 },
        unpaidLeave: { total: 10, used: 0 },
      };

  // Filter requests
  const displayRequests = leaveRequests.filter((r) => {
    if (!isAdmin && r.employeeId !== currentUser.employeeId) return false;
    if (selectedFilter !== 'All' && r.status !== selectedFilter) return false;
    return true;
  });

  const handleApprove = (id: string) => {
    db.updateLeaveStatus(id, 'Approved');
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 },
    });
    onLeaveUpdated();
  };

  const handleRejectConfirm = (reason: string) => {
    if (rejectingRequest) {
      db.updateLeaveStatus(rejectingRequest.id, 'Rejected', reason);
      setRejectingRequest(null);
      onLeaveUpdated();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Time Off & Leave Management</h1>
          <p className="text-xs text-slate-400">
            {isAdmin
              ? 'Review, approve, or reject leave applications submitted by workforce staff'
              : 'Track your annual leave entitlement balances and submit time off requests'}
          </p>
        </div>

        {!isAdmin && (
          <button
            onClick={() => setShowApplyModal(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-900/40 hover:from-purple-500 hover:to-indigo-500 transition-all active:scale-95 shrink-0"
          >
            <Plus className="h-4 w-4" />
            NEW Leave Request
          </button>
        )}
      </div>

      {/* Leave Entitlement Balance Cards (Employee View) */}
      {!isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400">Paid Time Off (PTO)</span>
              <p className="text-2xl font-black text-purple-400 mt-1">
                {leaveBalance.paidTimeOff.total - leaveBalance.paidTimeOff.used}{' '}
                <span className="text-xs font-normal text-slate-400">/ {leaveBalance.paidTimeOff.total} Days Left</span>
              </p>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-mono text-xs font-bold">
              PTO
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400">Sick Leave</span>
              <p className="text-2xl font-black text-cyan-400 mt-1">
                {leaveBalance.sickLeave.total - leaveBalance.sickLeave.used}{' '}
                <span className="text-xs font-normal text-slate-400">/ {leaveBalance.sickLeave.total} Days Left</span>
              </p>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-mono text-xs font-bold">
              SL
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400">Unpaid Leave</span>
              <p className="text-2xl font-black text-amber-400 mt-1">
                {leaveBalance.unpaidLeave.total - leaveBalance.unpaidLeave.used}{' '}
                <span className="text-xs font-normal text-slate-400">/ {leaveBalance.unpaidLeave.total} Days Left</span>
              </p>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-mono text-xs font-bold">
              UL
            </div>
          </div>
        </div>
      )}

      {/* Status Filter Toolbar */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-3 rounded-2xl">
        <div className="flex items-center gap-1 text-xs">
          {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                selectedFilter === filter
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400 font-mono hidden sm:inline">
          {displayRequests.length} Total Requests
        </span>
      </div>

      {/* Leave Requests Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="h-4 w-4 text-cyan-400" /> Leave Request Applications
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-6">Employee</th>
                <th className="py-3.5 px-6">Leave Type</th>
                <th className="py-3.5 px-6">Date Range</th>
                <th className="py-3.5 px-6">Duration</th>
                <th className="py-3.5 px-6">Remarks & Attachment</th>
                <th className="py-3.5 px-6">Status</th>
                {isAdmin && <th className="py-3.5 px-6 text-right">Approval Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {displayRequests.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="py-12 text-center text-slate-400 italic">
                    No leave requests found matching selected filter.
                  </td>
                </tr>
              ) : (
                displayRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-white">
                      <div>{req.employeeName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{req.employeeId}</div>
                    </td>
                    <td className="py-3.5 px-6 font-medium text-purple-300">{req.leaveType}</td>
                    <td className="py-3.5 px-6 font-mono text-slate-300">
                      {req.startDate} to {req.endDate}
                    </td>
                    <td className="py-3.5 px-6 font-mono font-bold text-cyan-400">
                      {req.numberOfDays} Day(s)
                    </td>
                    <td className="py-3.5 px-6 max-w-xs">
                      <p className="truncate text-slate-300">{req.remarks}</p>
                      {req.attachmentName && (
                        <div className="mt-1 inline-flex items-center gap-1 text-[10px] text-purple-400 bg-purple-950/60 border border-purple-800 px-2 py-0.5 rounded">
                          <Paperclip className="h-3 w-3" /> {req.attachmentName}
                        </div>
                      )}
                      {req.rejectionReason && (
                        <p className="mt-1 text-[10px] text-rose-300 italic">Reason: {req.rejectionReason}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`font-semibold px-2.5 py-1 rounded-full text-[11px] inline-flex items-center gap-1.5 ${
                          req.status === 'Approved'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : req.status === 'Rejected'
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {req.status === 'Approved' && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                        {req.status === 'Rejected' && <XCircle className="h-3.5 w-3.5 text-rose-400" />}
                        {req.status === 'Pending' && <Clock className="h-3.5 w-3.5 text-amber-400 animate-spin" />}
                        {req.status}
                      </span>
                    </td>

                    {/* Admin Actions */}
                    {isAdmin && (
                      <td className="py-3.5 px-6 text-right">
                        {req.status === 'Pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApprove(req.id)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-950/40 transition-all"
                            >
                              <Check className="h-3.5 w-3.5" /> Approve
                            </button>
                            <button
                              onClick={() => setRejectingRequest(req)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-md shadow-rose-950/40 transition-all"
                            >
                              <X className="h-3.5 w-3.5" /> Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">Processed</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <ApplyLeaveModal
          employeeId={currentUser.employeeId}
          employeeName={currentUser.name}
          onClose={() => setShowApplyModal(false)}
          onLeaveApplied={() => {
            onLeaveUpdated();
          }}
        />
      )}

      {/* Reject Leave Modal */}
      {rejectingRequest && (
        <RejectLeaveModal
          request={rejectingRequest}
          onClose={() => setRejectingRequest(null)}
          onConfirmReject={handleRejectConfirm}
        />
      )}
    </div>
  );
};
