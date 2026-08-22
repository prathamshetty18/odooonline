import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { db } from '../../services/db';
import type { EmployeeProfile } from '../../types';

interface AddEmployeeModalProps {
  onClose: () => void;
  onEmployeeAdded: (newEmp: EmployeeProfile) => void;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ onClose, onEmployeeAdded }) => {
  const generatedId = db.generateNextEmployeeId();

  const [formData, setFormData] = useState({
    name: '',
    jobPosition: '',
    department: 'Engineering',
    email: '',
    mobile: '+1 (555) ',
    location: 'San Francisco, CA',
    monthlyWage: 75000,
    about: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const created = db.addEmployee({
        name: formData.name,
        jobPosition: formData.jobPosition,
        department: formData.department,
        email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@dayflow.com`,
        mobile: formData.mobile,
        location: formData.location,
        resume: {
          about: formData.about || `Software & Technology professional at Dayflow.`,
          skills: ['Problem Solving', 'Collaboration', 'Productivity'],
          certifications: [],
        },
      });

      setLoading(false);
      onEmployeeAdded(created);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Add New Employee</h3>
              <p className="text-xs text-slate-400">
                Auto-assigned ID: <span className="font-mono text-purple-400 font-bold">{generatedId}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Jordan Lee"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 px-3.5 text-sm text-slate-100 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Job Position *</label>
              <input
                type="text"
                required
                value={formData.jobPosition}
                onChange={(e) => setFormData({ ...formData, jobPosition: e.target.value })}
                placeholder="e.g. Senior Frontend Dev"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 px-3.5 text-sm text-slate-100 focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 px-3.5 text-sm text-slate-100 focus:border-purple-500 focus:outline-none"
              >
                <option value="Engineering">Engineering</option>
                <option value="Design & Product">Design & Product</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Finance">Finance</option>
                <option value="Growth & Marketing">Growth & Marketing</option>
                <option value="Sales">Sales</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Work Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="jordan.lee@dayflow.com"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 px-3.5 text-sm text-slate-100 focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Mobile Phone</label>
              <input
                type="text"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 px-3.5 text-sm text-slate-100 focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Monthly Wage (₹ / $)</label>
              <input
                type="number"
                min="10000"
                value={formData.monthlyWage}
                onChange={(e) => setFormData({ ...formData, monthlyWage: Number(e.target.value) })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 px-3.5 text-sm text-slate-100 focus:border-purple-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Office Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 px-3.5 text-sm text-slate-100 focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">About / Bio</label>
            <textarea
              rows={2}
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              placeholder="Brief professional background summary..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 px-3.5 text-sm text-slate-100 focus:border-purple-500 focus:outline-none resize-none"
            />
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
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-sm font-semibold text-white shadow-lg shadow-purple-900/30 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Create Employee
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
