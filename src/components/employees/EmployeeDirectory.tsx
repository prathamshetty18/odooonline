import React, { useState } from 'react';
import { Search, UserPlus, MapPin, Mail, Building } from 'lucide-react';
import type { EmployeeProfile } from '../../types';
import { AddEmployeeModal } from './AddEmployeeModal';

interface EmployeeDirectoryProps {
  employees: EmployeeProfile[];
  onSelectEmployee: (emp: EmployeeProfile) => void;
  onEmployeeAdded: (emp: EmployeeProfile) => void;
  isAdmin: boolean;
}

export const EmployeeDirectory: React.FC<EmployeeDirectoryProps> = ({
  employees,
  onSelectEmployee,
  onEmployeeAdded,
  isAdmin,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const departments = Array.from(new Set(employees.map((e) => e.department)));

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.jobPosition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || emp.status === selectedStatus;
    const matchesDept = selectedDepartment === 'all' || emp.department === selectedDepartment;

    return matchesSearch && matchesStatus && matchesDept;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Directory Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Workforce Directory</h1>
          <p className="text-xs text-slate-400">
            Browse and manage all registered company personnel ({filteredEmployees.length} profiles displayed)
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-900/40 hover:from-purple-500 hover:to-indigo-500 transition-all active:scale-95 shrink-0"
          >
            <UserPlus className="h-4 w-4" />
            Add New Employee
          </button>
        )}
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, ID, position..."
            className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 pl-10 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:border-purple-500 focus:outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                selectedStatus === 'all' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedStatus('present')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                selectedStatus === 'present' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400'
              }`}
            >
              🟢 Present
            </button>
            <button
              onClick={() => setSelectedStatus('absent')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                selectedStatus === 'absent' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400'
              }`}
            >
              🟡 Absent
            </button>
            <button
              onClick={() => setSelectedStatus('leave')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                selectedStatus === 'leave' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'
              }`}
            >
              🔵 On Leave
            </button>
          </div>

          {/* Department Filter */}
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="rounded-xl bg-slate-950 border border-slate-800 py-2 px-3 text-xs text-slate-300 focus:border-purple-500 focus:outline-none"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredEmployees.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-slate-900/50 border border-slate-800">
          <p className="text-sm text-slate-400">No employee records match your search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              onClick={() => onSelectEmployee(emp)}
              className="glass-card cursor-pointer rounded-3xl p-6 border border-slate-800 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 h-24 w-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/15 transition-all" />

              <div>
                {/* Header with Avatar & Status Indicator */}
                <div className="flex items-start justify-between gap-4">
                  <div className="relative">
                    <img
                      src={emp.avatarUrl}
                      alt={emp.name}
                      className="h-16 w-16 rounded-2xl object-cover ring-2 ring-slate-700 group-hover:ring-purple-500 transition-all shadow-md"
                    />
                    <span
                      className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full ring-2 ring-slate-950 ${
                        emp.status === 'present'
                          ? 'bg-emerald-500'
                          : emp.status === 'absent'
                          ? 'bg-amber-500'
                          : 'bg-cyan-500'
                      }`}
                      title={`Status: ${emp.status}`}
                    />
                  </div>

                  {/* Status Pill */}
                  <span
                    className={
                      emp.status === 'present'
                        ? 'badge-present'
                        : emp.status === 'absent'
                        ? 'badge-absent'
                        : 'badge-leave'
                    }
                  >
                    {emp.status === 'present' && '🟢 Present'}
                    {emp.status === 'absent' && '🟡 Absent'}
                    {emp.status === 'leave' && '🔵 On Leave'}
                  </span>
                </div>

                {/* Employee Name & Job Info */}
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                      {emp.name}
                    </h3>
                    <span className="text-[11px] font-mono font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {emp.employeeId}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-400 mt-0.5">{emp.jobPosition}</p>
                </div>

                {/* Meta details */}
                <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Building className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                    <span className="truncate">{emp.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{emp.location}</span>
                  </div>
                </div>
              </div>

              {/* View Profile Action Hint */}
              <div className="mt-6 pt-3 border-t border-slate-800/50 flex items-center justify-between text-xs font-semibold text-purple-400 group-hover:text-purple-300">
                <span>View Full Profile</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
        <AddEmployeeModal
          onClose={() => setShowAddModal(false)}
          onEmployeeAdded={(newEmp) => {
            onEmployeeAdded(newEmp);
          }}
        />
      )}
    </div>
  );
};
