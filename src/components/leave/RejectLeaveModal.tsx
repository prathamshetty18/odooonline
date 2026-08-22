import React, { useState } from 'react';
import { X, XCircle } from 'lucide-react';
import type { LeaveRequest } from '../../types';

interface RejectLeaveModalProps {
  request: LeaveRequest;
  onClose: () => void;
  onConfirmReject: (reason: string) => void;
}

export const RejectLeaveModal: React.FC<RejectLeaveModalProps> = ({ request, onClose, onConfirmReject }) => {
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onConfirmReject(reason.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-rose-950/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <XCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Reject Leave Request</h3>
              <p className="text-xs text-slate-400">Specify reason for {request.employeeName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
            <p><strong className="text-white">Leave Type:</strong> {request.leaveType}</p>
            <p><strong className="text-white">Duration:</strong> {request.startDate} to {request.endDate} ({request.numberOfDays} days)</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Rejection Reason *</label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide constructive explanation for rejecting this leave request..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-slate-100 focus:border-rose-500 focus:outline-none resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white shadow-lg shadow-rose-950/40 transition-all"
            >
              Confirm Rejection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
