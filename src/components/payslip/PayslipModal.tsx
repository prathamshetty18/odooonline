import React from 'react';
import { X, Printer, Layers } from 'lucide-react';
import type { EmployeeProfile } from '../../types';

interface PayslipModalProps {
  employee: EmployeeProfile;
  onClose: () => void;
}

export const PayslipModal: React.FC<PayslipModalProps> = ({ employee, onClose }) => {
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const sal = employee.salaryInfo;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header Controls */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Layers className="h-5 w-5 text-purple-400" /> Dayflow Confidential Payslip
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
            >
              <Printer className="h-3.5 w-3.5" /> Print / Save PDF
            </button>
            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Payslip Body */}
        <div id="printable-payslip" className="p-8 space-y-6 bg-slate-950 text-slate-200 text-xs">
          {/* Header Info */}
          <div className="flex justify-between items-start border-b border-slate-800 pb-6">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">DAYFLOW TECHNOLOGIES INC.</h2>
              <p className="text-slate-400">742 Evergreen Terrace, San Francisco, CA 94107</p>
              <p className="text-purple-400 font-semibold mt-1">Salary Slip for {currentMonth}</p>
            </div>
            <div className="text-right font-mono">
              <p className="text-xs font-bold text-white">{employee.employeeId}</p>
              <p className="text-slate-400">Pay Period: Monthly</p>
            </div>
          </div>

          {/* Employee Details Grid */}
          <div className="grid grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div>
              <p className="text-slate-400">Employee Name:</p>
              <p className="font-bold text-white text-sm">{employee.name}</p>
            </div>
            <div>
              <p className="text-slate-400">Job Designation:</p>
              <p className="font-semibold text-slate-200">{employee.jobPosition}</p>
            </div>
            <div>
              <p className="text-slate-400">Department:</p>
              <p className="font-semibold text-slate-200">{employee.department}</p>
            </div>
            <div>
              <p className="text-slate-400">Bank Account:</p>
              <p className="font-mono text-slate-200">{employee.privateInfo.accountNumber}</p>
            </div>
          </div>

          {/* Earnings vs Deductions Table */}
          <div className="grid grid-cols-2 gap-6">
            {/* Earnings */}
            <div className="space-y-2">
              <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] border-b border-slate-800 pb-1">
                Earnings
              </h4>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>Basic Salary</span>
                  <span className="font-mono font-bold text-white">₹{sal.basicSalary.calculatedAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>House Rent Allowance</span>
                  <span className="font-mono font-bold text-white">₹{sal.houseRentAllowance.calculatedAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Allowance</span>
                  <span className="font-mono font-bold text-white">₹{sal.standardAllowance.calculatedAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Performance Bonus</span>
                  <span className="font-mono font-bold text-white">₹{sal.performanceBonus.calculatedAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fixed Allowance</span>
                  <span className="font-mono font-bold text-white">₹{sal.fixedAllowance.calculatedAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="space-y-2">
              <h4 className="font-bold text-rose-400 uppercase tracking-wider text-[11px] border-b border-slate-800 pb-1">
                Deductions
              </h4>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>Provident Fund (PF)</span>
                  <span className="font-mono text-rose-400">₹{sal.pfContribution.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Professional Tax</span>
                  <span className="font-mono text-rose-400">₹{sal.professionalTax.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Totals Summary Banner */}
          <div className="pt-4 border-t border-slate-800 flex justify-between items-center bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <div>
              <p className="text-slate-400 font-medium">Net Salary Payable:</p>
              <p className="text-2xl font-black text-emerald-400 font-mono">
                ₹{sal.netSalary.toLocaleString()}
              </p>
            </div>
            <div className="text-right text-[11px] text-slate-400">
              <p>Gross Earnings: ₹{sal.totalSalary.toLocaleString()}</p>
              <p>Total Deductions: ₹{sal.totalDeductions.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
