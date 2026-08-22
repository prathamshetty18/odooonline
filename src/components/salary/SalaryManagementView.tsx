import React, { useState } from 'react';
import { DollarSign, Edit3, FileText, Search } from 'lucide-react';
import type { EmployeeProfile, User } from '../../types';
import { EditSalaryModal } from './EditSalaryModal';
import { PayslipModal } from '../payslip/PayslipModal';

interface SalaryManagementViewProps {
  currentUser: User;
  employees: EmployeeProfile[];
  onSalaryUpdated: (updated: EmployeeProfile) => void;
  isAdmin: boolean;
}

export const SalaryManagementView: React.FC<SalaryManagementViewProps> = ({
  currentUser,
  employees,
  onSalaryUpdated,
  isAdmin,
}) => {
  const [editingEmployee, setEditingEmployee] = useState<EmployeeProfile | null>(null);
  const [payslipEmployee, setPayslipEmployee] = useState<EmployeeProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // If employee, filter only self
  const displayEmployees = isAdmin
    ? employees.filter((e) =>
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.department.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : employees.filter((e) => e.employeeId === currentUser.employeeId);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Payroll & Salary Management</h1>
          <p className="text-xs text-slate-400">
            {isAdmin
              ? 'Manage workforce compensation structures, percentage components, and generate monthly payslips'
              : 'View your confidential compensation structure, allowances, tax deductions, and download payslip'}
          </p>
        </div>
      </div>

      {/* Admin Search Bar */}
      {isAdmin && (
        <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search employee by name, ID..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 pl-10 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
            />
          </div>

          <span className="text-xs font-mono text-slate-400 hidden sm:inline">
            Total Payroll: {displayEmployees.length} Personnel
          </span>
        </div>
      )}

      {/* Salary Roster Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-400" /> Compensation Structures
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-6">Employee</th>
                <th className="py-3.5 px-6">Wage Type</th>
                <th className="py-3.5 px-6">Monthly Wage</th>
                <th className="py-3.5 px-6">Basic Salary</th>
                <th className="py-3.5 px-6">HRA</th>
                <th className="py-3.5 px-6">PF & Tax Deductions</th>
                <th className="py-3.5 px-6">Net Take-Home</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {displayEmployees.map((emp) => {
                const sal = emp.salaryInfo;
                return (
                  <tr key={emp.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-white">
                      <div className="flex items-center gap-3">
                        <img src={emp.avatarUrl} alt={emp.name} className="h-9 w-9 rounded-xl object-cover" />
                        <div>
                          <div>{emp.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{emp.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 font-medium text-purple-300">{sal.wageType}</td>
                    <td className="py-3.5 px-6 font-mono font-bold text-white">
                      ₹{sal.monthlyWage.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-6 font-mono text-slate-300">
                      ₹{sal.basicSalary.calculatedAmount.toLocaleString()} ({sal.basicSalary.value}%)
                    </td>
                    <td className="py-3.5 px-6 font-mono text-slate-300">
                      ₹{sal.houseRentAllowance.calculatedAmount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-6 font-mono text-rose-400">
                      - ₹{sal.totalDeductions.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-6 font-mono font-extrabold text-emerald-400 text-sm">
                      ₹{sal.netSalary.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-6 text-right space-x-2">
                      <button
                        onClick={() => setPayslipEmployee(emp)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600/20 text-purple-300 hover:bg-purple-600 hover:text-white font-semibold transition-all"
                      >
                        <FileText className="h-3.5 w-3.5" /> Payslip
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => setEditingEmployee(emp)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-all"
                        >
                          <Edit3 className="h-3.5 w-3.5" /> Edit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Salary Modal */}
      {editingEmployee && (
        <EditSalaryModal
          employee={editingEmployee}
          onClose={() => setEditingEmployee(null)}
          onSalaryUpdated={(updated) => {
            onSalaryUpdated(updated);
          }}
        />
      )}

      {/* Payslip Modal */}
      {payslipEmployee && (
        <PayslipModal employee={payslipEmployee} onClose={() => setPayslipEmployee(null)} />
      )}
    </div>
  );
};
