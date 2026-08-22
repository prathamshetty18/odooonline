import React, { useState } from 'react';
import { X, DollarSign, Percent, Check } from 'lucide-react';
import type { EmployeeProfile, WageType } from '../../types';
import { calculateSalaryDetails, db } from '../../services/db';

interface EditSalaryModalProps {
  employee: EmployeeProfile;
  onClose: () => void;
  onSalaryUpdated: (updated: EmployeeProfile) => void;
}

export const EditSalaryModal: React.FC<EditSalaryModalProps> = ({ employee, onClose, onSalaryUpdated }) => {
  const [wageType, setWageType] = useState<WageType>(employee.salaryInfo.wageType);
  const [monthlyWage, setMonthlyWage] = useState<number>(employee.salaryInfo.monthlyWage);

  const [basicPct, setBasicPct] = useState<number>(employee.salaryInfo.basicSalary.value);
  const [hraPct, setHraPct] = useState<number>(employee.salaryInfo.houseRentAllowance.value);
  const [stdPct, setStdPct] = useState<number>(employee.salaryInfo.standardAllowance.value);
  const [bonusPct, setBonusPct] = useState<number>(employee.salaryInfo.performanceBonus.value);

  // Live calculated preview
  const liveSalary = calculateSalaryDetails(monthlyWage, wageType, {
    basicPct,
    hraPctOfBasic: hraPct,
    stdAllowancePct: stdPct,
    bonusPct,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = db.updateEmployeeProfile(employee.id, {
      salaryInfo: liveSalary,
    });
    if (updated) {
      onSalaryUpdated(updated);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Edit Salary Configuration</h3>
              <p className="text-xs text-slate-400">
                Adjust wage & dynamic percentages for <span className="text-purple-300 font-bold">{employee.name}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs">
          {/* Wage Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Wage Type</label>
              <select
                value={wageType}
                onChange={(e) => setWageType(e.target.value as WageType)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:outline-none"
              >
                <option value="Monthly">Monthly Wage</option>
                <option value="Yearly">Yearly Wage (CTC)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Monthly Wage (₹)</label>
              <input
                type="number"
                min="10000"
                value={monthlyWage}
                onChange={(e) => setMonthlyWage(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white font-mono focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Percentage Controls */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Percent className="h-4 w-4 text-purple-400" /> Salary Component Percentages
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1">Basic Salary (% of Wage): {basicPct}%</label>
                <input
                  type="range"
                  min="30"
                  max="70"
                  value={basicPct}
                  onChange={(e) => setBasicPct(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">HRA (% of Basic): {hraPct}%</label>
                <input
                  type="range"
                  min="20"
                  max="60"
                  value={hraPct}
                  onChange={(e) => setHraPct(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Standard Allowance (%): {stdPct}%</label>
                <input
                  type="range"
                  min="5"
                  max="20"
                  value={stdPct}
                  onChange={(e) => setStdPct(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Performance Bonus (%): {bonusPct}%</label>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={bonusPct}
                  onChange={(e) => setBonusPct(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Real-time Recalculated Summary */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-purple-800/40 space-y-2">
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              Live Recalculation Preview
            </span>
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-2 rounded-xl bg-slate-900">
                <span className="text-[10px] text-slate-400">Basic</span>
                <p className="font-bold text-white font-mono">₹{liveSalary.basicSalary.calculatedAmount.toLocaleString()}</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-900">
                <span className="text-[10px] text-slate-400">HRA</span>
                <p className="font-bold text-white font-mono">₹{liveSalary.houseRentAllowance.calculatedAmount.toLocaleString()}</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-900">
                <span className="text-[10px] text-emerald-400 font-semibold">Net Salary</span>
                <p className="font-extrabold text-emerald-400 font-mono">₹{liveSalary.netSalary.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-lg shadow-emerald-950/40"
            >
              <Check className="h-4 w-4" /> Save Salary Config
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
