import React, { useState } from 'react';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building,
  MapPin,
  Award,
  BookOpen,
  Lock,
  DollarSign,
  Edit3,
  Save,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import type { EmployeeProfile, User } from '../../types';
import { db, calculateSalaryDetails } from '../../services/db';

interface EmployeeProfileViewProps {
  employee: EmployeeProfile;
  currentUser: User;
  onBack: () => void;
  onProfileUpdated: (updated: EmployeeProfile) => void;
}

export const EmployeeProfileView: React.FC<EmployeeProfileViewProps> = ({
  employee,
  currentUser,
  onBack,
  onProfileUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'resume' | 'private' | 'salary' | 'security'>('resume');

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const isAdmin = currentUser.role === 'admin';
  const isOwnProfile = currentUser.employeeId === employee.employeeId;

  // Local state for profile fields
  const [formData, setFormData] = useState({
    name: employee.name,
    jobPosition: employee.jobPosition,
    department: employee.department,
    email: employee.email,
    mobile: employee.mobile,
    company: employee.company,
    manager: employee.manager,
    location: employee.location,

    about: employee.resume.about,
    skills: [...employee.resume.skills],
    newSkillInput: '',

    dateOfBirth: employee.privateInfo.dateOfBirth,
    address: employee.privateInfo.address,
    personalEmail: employee.privateInfo.personalEmail,
    gender: employee.privateInfo.gender,
    maritalStatus: employee.privateInfo.maritalStatus,
    dateOfJoining: employee.privateInfo.dateOfJoining,
    bankName: employee.privateInfo.bankName,
    accountNumber: employee.privateInfo.accountNumber,
    ifsc: employee.privateInfo.ifsc,
    pan: employee.privateInfo.pan,
    uan: employee.privateInfo.uan,

    monthlyWage: employee.salaryInfo.monthlyWage,
    wageType: employee.salaryInfo.wageType,
  });

  // Security password state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Save edits handler
  const handleSaveProfile = () => {
    const salaryUpdates = isAdmin
      ? calculateSalaryDetails(formData.monthlyWage, formData.wageType)
      : employee.salaryInfo;

    const updated = db.updateEmployeeProfile(employee.id, {
      name: formData.name,
      jobPosition: formData.jobPosition,
      department: formData.department,
      email: formData.email,
      mobile: formData.mobile,
      company: formData.company,
      manager: formData.manager,
      location: formData.location,
      resume: {
        ...employee.resume,
        about: formData.about,
        skills: formData.skills,
      },
      privateInfo: {
        ...employee.privateInfo,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        personalEmail: formData.personalEmail,
        gender: formData.gender,
        maritalStatus: formData.maritalStatus,
        dateOfJoining: formData.dateOfJoining,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        ifsc: formData.ifsc,
        pan: formData.pan,
        uan: formData.uan,
      },
      salaryInfo: salaryUpdates,
    });

    if (updated) {
      onProfileUpdated(updated);
      setIsEditing(false);
    }
  };

  const handleAddSkill = () => {
    if (formData.newSkillInput.trim()) {
      setFormData({
        ...formData,
        skills: [...formData.skills, formData.newSkillInput.trim()],
        newSkillInput: '',
      });
    }
  };

  const handleRemoveSkill = (index: number) => {
    const updated = [...formData.skills];
    updated.splice(index, 1);
    setFormData({ ...formData, skills: updated });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (passwordForm.newPassword.length < 5) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 5 characters long.' });
      return;
    }

    const success = db.changePassword(employee.email, passwordForm.currentPassword, passwordForm.newPassword);
    if (success) {
      setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      setPasswordMsg({ type: 'error', text: 'Current password verification failed.' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Directory
        </button>

        <div className="flex items-center gap-3">
          {isEditing ? (
            <button
              onClick={handleSaveProfile}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-950/40 transition-all"
            >
              <Save className="h-3.5 w-3.5" /> Save Profile
            </button>
          ) : (
            (isAdmin || isOwnProfile) && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-purple-950/40 transition-all"
              >
                <Edit3 className="h-3.5 w-3.5" /> Edit Profile
              </button>
            )
          )}
        </div>
      </div>

      {/* Main Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <img
              src={employee.avatarUrl}
              alt={employee.name}
              className="h-24 w-24 rounded-3xl object-cover ring-4 ring-purple-500/30 shadow-xl"
            />

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white tracking-tight">{employee.name}</h1>
                <span className="text-xs font-mono font-bold text-purple-300 bg-purple-950/60 border border-purple-800 px-2.5 py-0.5 rounded-full">
                  {employee.employeeId}
                </span>
              </div>

              {isEditing && isAdmin ? (
                <input
                  type="text"
                  value={formData.jobPosition}
                  onChange={(e) => setFormData({ ...formData, jobPosition: e.target.value })}
                  className="rounded-lg bg-slate-950 border border-slate-800 px-2 py-1 text-xs text-white"
                />
              ) : (
                <p className="text-sm font-semibold text-slate-300">{employee.jobPosition}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
                <span className="flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5 text-purple-400" /> {employee.department}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-indigo-400" /> {employee.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-cyan-400" /> {employee.mobile}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-emerald-400" /> {employee.location}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 shrink-0">
            <div className="text-xs text-slate-400">Reporting Manager</div>
            <div className="text-sm font-bold text-slate-200">{employee.manager}</div>
            <div className="text-[11px] text-purple-400 font-medium">{employee.company}</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 flex border-b border-slate-800/80 gap-6 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('resume')}
            className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
              activeTab === 'resume'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Resume / Bio
          </button>
          <button
            onClick={() => setActiveTab('private')}
            className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
              activeTab === 'private'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Private Info
          </button>
          <button
            onClick={() => setActiveTab('salary')}
            className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
              activeTab === 'salary'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Salary Info
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
              activeTab === 'security'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Security & Auth
          </button>
        </div>
      </div>

      {/* Tab 1: Resume */}
      {activeTab === 'resume' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-purple-400" /> About
            </h3>
            {isEditing ? (
              <textarea
                rows={4}
                value={formData.about}
                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-slate-100 focus:border-purple-500 focus:outline-none"
              />
            ) : (
              <p className="text-sm text-slate-300 leading-relaxed">{employee.resume.about}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skills */}
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="h-4 w-4 text-cyan-400" /> Technical Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-950/60 border border-purple-800 text-xs font-semibold text-purple-300"
                  >
                    {skill}
                    {isEditing && (
                      <button onClick={() => handleRemoveSkill(idx)} className="text-rose-400 hover:text-rose-300">
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>

              {isEditing && (
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={formData.newSkillInput}
                    onChange={(e) => setFormData({ ...formData, newSkillInput: e.target.value })}
                    placeholder="Add skill tag..."
                    className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-white focus:outline-none"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 text-xs font-semibold text-white"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>

            {/* Certifications */}
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-400" /> Certifications & Badges
              </h3>
              <div className="space-y-3">
                {employee.resume.certifications.length === 0 ? (
                  <p className="text-xs text-slate-400">No certifications recorded.</p>
                ) : (
                  employee.resume.certifications.map((cert, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                      <p className="font-bold text-white">{cert.title}</p>
                      <p className="text-slate-400">
                        {cert.issuer} • Issued {cert.date}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Private Info */}
      {activeTab === 'private' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="h-4 w-4 text-purple-400" /> Confidential Personal & Banking Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400">Date of Birth</span>
              {isEditing && isAdmin ? (
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2 text-white"
                />
              ) : (
                <p className="font-semibold text-white">{employee.privateInfo.dateOfBirth}</p>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-slate-400">Gender</span>
              <p className="font-semibold text-white">{employee.privateInfo.gender}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400">Marital Status</span>
              <p className="font-semibold text-white">{employee.privateInfo.maritalStatus}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400">Personal Email</span>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.personalEmail}
                  onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2 text-white"
                />
              ) : (
                <p className="font-semibold text-white">{employee.privateInfo.personalEmail}</p>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-slate-400">Residential Address</span>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2 text-white"
                />
              ) : (
                <p className="font-semibold text-white">{employee.privateInfo.address}</p>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-slate-400">Date of Joining</span>
              <p className="font-semibold text-white">{employee.privateInfo.dateOfJoining}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400">Bank Name</span>
              <p className="font-semibold text-white">{employee.privateInfo.bankName}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400">Account Number</span>
              <p className="font-mono font-semibold text-white">{employee.privateInfo.accountNumber}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400">IFSC Code</span>
              <p className="font-mono font-semibold text-white">{employee.privateInfo.ifsc}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400">PAN Card Number</span>
              <p className="font-mono font-semibold text-white">{employee.privateInfo.pan}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400">UAN (Provident Fund)</span>
              <p className="font-mono font-semibold text-white">{employee.privateInfo.uan}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Salary Info */}
      {activeTab === 'salary' && (
        <div className="space-y-6">
          {/* Salary Breakdown Header */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-emerald-400" /> Salary Structure & Compensation
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Calculated using standard payroll percentage components
                </p>
              </div>

              {isEditing && isAdmin && (
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-slate-300">Edit Monthly Wage:</label>
                  <input
                    type="number"
                    value={formData.monthlyWage}
                    onChange={(e) => setFormData({ ...formData, monthlyWage: Number(e.target.value) })}
                    className="w-32 rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              )}
            </div>

            {/* Summary metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-xs text-slate-400">Gross Monthly Wage</span>
                <p className="text-xl font-bold text-white font-mono">
                  ₹{employee.salaryInfo.monthlyWage.toLocaleString()}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-xs text-slate-400">Total Deductions (PF+Tax)</span>
                <p className="text-xl font-bold text-rose-400 font-mono">
                  ₹{employee.salaryInfo.totalDeductions.toLocaleString()}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 col-span-1 sm:col-span-2 bg-gradient-to-r from-emerald-950/40 to-slate-950 border-emerald-800/40">
                <span className="text-xs text-emerald-300 font-medium">Estimated Take-Home (Net Salary)</span>
                <p className="text-2xl font-black text-emerald-400 font-mono">
                  ₹{employee.salaryInfo.netSalary.toLocaleString()}
                  <span className="text-xs font-normal text-slate-400"> / month</span>
                </p>
              </div>
            </div>

            {/* Salary Components Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Component Name</th>
                    <th className="py-3 px-4">Calculation Mode</th>
                    <th className="py-3 px-4">Ratio / Rate</th>
                    <th className="py-3 px-4 text-right">Calculated Monthly Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">Basic Salary</td>
                    <td className="py-3 px-4 text-purple-400 font-medium">Percentage</td>
                    <td className="py-3 px-4 font-mono">{employee.salaryInfo.basicSalary.value}% of Wage</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-white">
                      ₹{employee.salaryInfo.basicSalary.calculatedAmount.toLocaleString()}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">House Rent Allowance (HRA)</td>
                    <td className="py-3 px-4 text-purple-400 font-medium">Percentage</td>
                    <td className="py-3 px-4 font-mono">{employee.salaryInfo.houseRentAllowance.value}% of Basic</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-white">
                      ₹{employee.salaryInfo.houseRentAllowance.calculatedAmount.toLocaleString()}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">Standard Allowance</td>
                    <td className="py-3 px-4 text-purple-400 font-medium">Percentage</td>
                    <td className="py-3 px-4 font-mono">{employee.salaryInfo.standardAllowance.value}% of Wage</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-white">
                      ₹{employee.salaryInfo.standardAllowance.calculatedAmount.toLocaleString()}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">Performance Bonus</td>
                    <td className="py-3 px-4 text-purple-400 font-medium">Percentage</td>
                    <td className="py-3 px-4 font-mono">{employee.salaryInfo.performanceBonus.value}% of Wage</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-white">
                      ₹{employee.salaryInfo.performanceBonus.calculatedAmount.toLocaleString()}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">Leave Travel Allowance (LTA)</td>
                    <td className="py-3 px-4 text-purple-400 font-medium">Percentage</td>
                    <td className="py-3 px-4 font-mono">{employee.salaryInfo.leaveTravelAllowance.value}% of Wage</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-white">
                      ₹{employee.salaryInfo.leaveTravelAllowance.calculatedAmount.toLocaleString()}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">Fixed Allowance</td>
                    <td className="py-3 px-4 text-cyan-400 font-medium">Fixed Amount</td>
                    <td className="py-3 px-4 font-mono">Balanced</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-white">
                      ₹{employee.salaryInfo.fixedAllowance.calculatedAmount.toLocaleString()}
                    </td>
                  </tr>

                  <tr className="bg-rose-950/20 text-rose-300 font-semibold">
                    <td className="py-3 px-4">Provident Fund (PF Contribution)</td>
                    <td className="py-3 px-4">Deduction</td>
                    <td className="py-3 px-4 font-mono">12% of Basic</td>
                    <td className="py-3 px-4 text-right font-mono text-rose-400">
                      - ₹{employee.salaryInfo.pfContribution.toLocaleString()}
                    </td>
                  </tr>

                  <tr className="bg-rose-950/20 text-rose-300 font-semibold">
                    <td className="py-3 px-4">Professional Tax</td>
                    <td className="py-3 px-4">Deduction</td>
                    <td className="py-3 px-4 font-mono">Statutory</td>
                    <td className="py-3 px-4 text-right font-mono text-rose-400">
                      - ₹{employee.salaryInfo.professionalTax.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Security */}
      {activeTab === 'security' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 max-w-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="h-4 w-4 text-purple-400" /> Account Security & Password
          </h3>

          {passwordMsg && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                passwordMsg.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
              }`}
            >
              {passwordMsg.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0" />
              )}
              {passwordMsg.text}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Current Password</label>
              <input
                type="password"
                required
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                placeholder="Enter current password"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">New Password</label>
              <input
                type="password"
                required
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="Enter new password"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white shadow-lg shadow-purple-900/30 transition-all"
            >
              Update Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
