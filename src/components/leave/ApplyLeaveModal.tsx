import React, { useState, useEffect } from 'react';
import { X, Calendar, Upload } from 'lucide-react';
import type { LeaveType, LeaveRequest } from '../../types';
import { db } from '../../services/db';

interface ApplyLeaveModalProps {
  employeeId: string;
  employeeName: string;
  onClose: () => void;
  onLeaveApplied: (newRequest: LeaveRequest) => void;
}

export const ApplyLeaveModal: React.FC<ApplyLeaveModalProps> = ({
  employeeId,
  employeeName,
  onClose,
  onLeaveApplied,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [leaveType, setLeaveType] = useState<LeaveType>('Paid Time Off');
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [numberOfDays, setNumberOfDays] = useState(1);
  const [remarks, setRemarks] = useState('');
  const [attachmentName, setAttachmentName] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  // Recalculate days when dates change
  useEffect(() => {
    if (startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      const diffTime = Math.max(0, e.getTime() - s.getTime());
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setNumberOfDays(isNaN(days) ? 1 : Math.max(1, days));
    }
  }, [startDate, endDate]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachmentName(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const created = db.applyLeave({
        employeeId,
        employeeName,
        leaveType,
        startDate,
        endDate,
        remarks,
        attachmentName: attachmentName || (leaveType === 'Sick Leave' ? 'medical_certificate.pdf' : undefined),
        attachmentUrl: attachmentName ? 'blob:simulated-medical-cert' : undefined,
      });

      setLoading(false);
      onLeaveApplied(created);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Apply for Time Off / Leave</h3>
              <p className="text-xs text-slate-400">Submit request for HR and Manager approval</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Leave Type *</label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value as LeaveType)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 px-3.5 text-sm text-slate-100 focus:border-purple-500 focus:outline-none"
            >
              <option value="Paid Time Off">Paid Time Off (PTO)</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Unpaid Leave">Unpaid Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 px-3.5 text-sm text-slate-100 focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">End Date *</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 px-3.5 text-sm text-slate-100 focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Calculated Leave Duration:</span>
            <span className="font-bold text-purple-400 text-sm font-mono">{numberOfDays} Day(s)</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Remarks / Reason *</label>
            <textarea
              required
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="State reason for your leave request..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-slate-100 focus:border-purple-500 focus:outline-none resize-none"
            />
          </div>

          {/* Medical Certificate Upload for Sick Leave */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              Attachment / Medical Certificate {leaveType === 'Sick Leave' ? '(Recommended)' : '(Optional)'}
            </label>
            <div className="relative border-2 border-dashed border-slate-800 hover:border-purple-500/50 rounded-2xl p-4 text-center cursor-pointer bg-slate-950/50 transition-colors">
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.png,.jpg,.jpeg"
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload className="mx-auto h-6 w-6 text-slate-500 mb-1" />
              {attachmentName ? (
                <p className="text-xs font-semibold text-purple-300 truncate">{attachmentName}</p>
              ) : (
                <p className="text-xs text-slate-400">Click to upload doctor's note or supporting doc (PDF, PNG)</p>
              )}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-800 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-sm font-semibold text-white shadow-lg shadow-cyan-900/30 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                'Submit Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
