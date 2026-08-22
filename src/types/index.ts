export type Role = 'admin' | 'employee';

export type UserStatus = 'present' | 'absent' | 'leave';

export interface User {
  id: string;
  email: string;
  loginId: string; // e.g. DFPRSH20260001
  role: Role;
  employeeId: string;
  name: string;
  avatarUrl: string;
  companyName?: string;
}

export interface ResumeInfo {
  about: string;
  skills: string[];
  certifications: {
    title: string;
    issuer: string;
    date: string;
  }[];
}

export interface PrivateInfo {
  dateOfBirth: string;
  address: string;
  personalEmail: string;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  dateOfJoining: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  pan: string;
  uan: string;
}

export type WageType = 'Monthly' | 'Hourly' | 'Yearly';

export interface SalaryComponent {
  id: string;
  name: string;
  type: 'fixed' | 'percentage';
  value: number;
  calculatedAmount: number;
}

export interface SalaryInfo {
  wageType: WageType;
  monthlyWage: number;
  yearlyWage: number;
  workingDays: number;
  breakTime: string;
  basicSalary: SalaryComponent;
  houseRentAllowance: SalaryComponent;
  standardAllowance: SalaryComponent;
  performanceBonus: SalaryComponent;
  leaveTravelAllowance: SalaryComponent;
  fixedAllowance: SalaryComponent;
  pfContribution: number;
  professionalTax: number;
  totalSalary: number;
  totalDeductions: number;
  netSalary: number;
}

export interface EmployeeProfile {
  id: string;
  employeeId: string; // e.g. DFPRSH20260001
  loginId: string;
  name: string;
  jobPosition: string;
  email: string;
  mobile: string;
  company: string;
  department: string;
  manager: string;
  location: string;
  avatarUrl: string;
  status: UserStatus;
  resume: ResumeInfo;
  privateInfo: PrivateInfo;
  salaryInfo: SalaryInfo;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  workHours: number;
  extraHours: number;
  status: 'present' | 'absent' | 'leave';
}

export type LeaveType = 'Paid Time Off' | 'Sick Leave' | 'Unpaid Leave';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  remarks: string;
  attachmentName?: string;
  attachmentUrl?: string;
  status: LeaveStatus;
  appliedDate: string;
  rejectionReason?: string;
}

export interface LeaveBalance {
  paidTimeOff: { total: number; used: number };
  sickLeave: { total: number; used: number };
  unpaidLeave: { total: number; used: number };
}
