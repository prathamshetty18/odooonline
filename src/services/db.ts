import type {
  EmployeeProfile,
  AttendanceRecord,
  LeaveRequest,
  SalaryInfo,
  User,
  LeaveBalance,
  WageType,
} from '../types';

const USERS_KEY = 'dayflow_v3_users';
const EMPLOYEES_KEY = 'dayflow_v3_employees';
const ATTENDANCE_KEY = 'dayflow_v3_attendance';
const LEAVE_KEY = 'dayflow_v3_leave_requests';

// Generate Login ID using the exact Wireframe Format:
// [Company Prefix 2 letters] + [First 2 letters of First Name + Last Name] + [Year of Joining] + [Serial Number 4 digits]
// Example: Dayflow India + Priya Sharma + 2026 + 0002 -> DFPRSH20260002
export function generateWireframeLoginId(
  companyName: string,
  fullName: string,
  joiningYear: number = new Date().getFullYear(),
  serial: number = 1
): string {
  // Company Prefix (e.g. Odoo India -> OI, Dayflow Technologies -> DF)
  const cleanComp = companyName.trim().replace(/[^a-zA-Z]/g, '');
  const compPrefix = cleanComp.length >= 2 ? cleanComp.substring(0, 2).toUpperCase() : 'DF';

  // Name 4 letters (First 2 of First Name + First 2 of Last Name)
  const nameParts = fullName.trim().split(/\s+/);
  const firstName = nameParts[0] || 'User';
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : firstName;

  const f2 = firstName.substring(0, 2).padEnd(2, 'X').toUpperCase();
  const l2 = lastName.substring(0, 2).padEnd(2, 'X').toUpperCase();

  const nameCode = `${f2}${l2}`;
  const yearStr = joiningYear.toString();
  const serialStr = serial.toString().padStart(4, '0');

  return `${compPrefix}${nameCode}${yearStr}${serialStr}`;
}

export function calculateSalaryDetails(
  monthlyWage: number,
  wageType: WageType = 'Monthly',
  customPercentages?: {
    basicPct?: number;
    hraPctOfBasic?: number;
    stdAllowancePct?: number;
    bonusPct?: number;
    ltaPct?: number;
    pfPctOfBasic?: number;
    profTax?: number;
  }
): SalaryInfo {
  const basicPct = customPercentages?.basicPct ?? 50;
  const hraPctOfBasic = customPercentages?.hraPctOfBasic ?? 50;
  const stdAllowancePct = customPercentages?.stdAllowancePct ?? 10;
  const bonusPct = customPercentages?.bonusPct ?? 10;
  const ltaPct = customPercentages?.ltaPct ?? 5;
  const pfPctOfBasic = customPercentages?.pfPctOfBasic ?? 12;
  const profTax = customPercentages?.profTax ?? 200;

  const yearlyWage = wageType === 'Yearly' ? monthlyWage : monthlyWage * 12;
  const effectiveMonthlyWage = wageType === 'Yearly' ? Math.round(monthlyWage / 12) : monthlyWage;

  const basicAmount = Math.round((effectiveMonthlyWage * basicPct) / 100);
  const hraAmount = Math.round((basicAmount * hraPctOfBasic) / 100);
  const stdAllowanceAmount = Math.round((effectiveMonthlyWage * stdAllowancePct) / 100);
  const bonusAmount = Math.round((effectiveMonthlyWage * bonusPct) / 100);
  const ltaAmount = Math.round((effectiveMonthlyWage * ltaPct) / 100);

  const subtotalAllocated = basicAmount + hraAmount + stdAllowanceAmount + bonusAmount + ltaAmount;
  const fixedAllowanceAmount = Math.max(0, effectiveMonthlyWage - subtotalAllocated);

  const pfContribution = Math.round((basicAmount * pfPctOfBasic) / 100);
  const totalSalary = basicAmount + hraAmount + stdAllowanceAmount + bonusAmount + ltaAmount + fixedAllowanceAmount;
  const totalDeductions = pfContribution + profTax;
  const netSalary = totalSalary - totalDeductions;

  return {
    wageType,
    monthlyWage: effectiveMonthlyWage,
    yearlyWage,
    workingDays: 22,
    breakTime: '1 Hour',
    basicSalary: {
      id: 'comp_basic',
      name: 'Basic Salary',
      type: 'percentage',
      value: basicPct,
      calculatedAmount: basicAmount,
    },
    houseRentAllowance: {
      id: 'comp_hra',
      name: 'House Rent Allowance (HRA)',
      type: 'percentage',
      value: hraPctOfBasic,
      calculatedAmount: hraAmount,
    },
    standardAllowance: {
      id: 'comp_std',
      name: 'Standard Allowance',
      type: 'percentage',
      value: stdAllowancePct,
      calculatedAmount: stdAllowanceAmount,
    },
    performanceBonus: {
      id: 'comp_bonus',
      name: 'Performance Bonus',
      type: 'percentage',
      value: bonusPct,
      calculatedAmount: bonusAmount,
    },
    leaveTravelAllowance: {
      id: 'comp_lta',
      name: 'Leave Travel Allowance (LTA)',
      type: 'percentage',
      value: ltaPct,
      calculatedAmount: ltaAmount,
    },
    fixedAllowance: {
      id: 'comp_fixed',
      name: 'Fixed Allowance',
      type: 'fixed',
      value: fixedAllowanceAmount,
      calculatedAmount: fixedAllowanceAmount,
    },
    pfContribution,
    professionalTax: profTax,
    totalSalary,
    totalDeductions,
    netSalary,
  };
}

// Initial Indian Seed Users & Employees
const INITIAL_USERS: (User & { passwordHash: string })[] = [
  {
    id: 'usr_admin',
    email: 'admin@dayflow.com',
    loginId: 'DFAAME20260001',
    passwordHash: 'admin123',
    role: 'admin',
    employeeId: 'DFAAME20260001',
    name: 'Aarav Mehta (HR Admin)',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=250&auto=format&fit=crop&q=80',
    companyName: 'Dayflow India',
  },
  {
    id: 'usr_emp1',
    email: 'priya.sharma@dayflow.com',
    loginId: 'DFPRSH20260002',
    passwordHash: 'emp123',
    role: 'employee',
    employeeId: 'DFPRSH20260002',
    name: 'Priya Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=80',
    companyName: 'Dayflow India',
  },
  {
    id: 'usr_emp2',
    email: 'rohan.verma@dayflow.com',
    loginId: 'DFROVE20260003',
    passwordHash: 'emp123',
    role: 'employee',
    employeeId: 'DFROVE20260003',
    name: 'Rohan Verma',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80',
    companyName: 'Dayflow India',
  },
  {
    id: 'usr_emp3',
    email: 'ananya.deshmukh@dayflow.com',
    loginId: 'DFANDE20260004',
    passwordHash: 'emp123',
    role: 'employee',
    employeeId: 'DFANDE20260004',
    name: 'Ananya Deshmukh',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
    companyName: 'Dayflow India',
  },
  {
    id: 'usr_emp4',
    email: 'vikram.patel@dayflow.com',
    loginId: 'DFVIPA20260005',
    passwordHash: 'emp123',
    role: 'employee',
    employeeId: 'DFVIPA20260005',
    name: 'Vikram Patel',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80',
    companyName: 'Dayflow India',
  },
  {
    id: 'usr_emp5',
    email: 'kavya.nair@dayflow.com',
    loginId: 'DFKANA20260006',
    passwordHash: 'emp123',
    role: 'employee',
    employeeId: 'DFKANA20260006',
    name: 'Kavya Nair',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=250&auto=format&fit=crop&q=80',
    companyName: 'Dayflow India',
  },
];

const INITIAL_EMPLOYEES: EmployeeProfile[] = [
  {
    id: 'emp_1000',
    employeeId: 'DFAAME20260001',
    loginId: 'DFAAME20260001',
    name: 'Aarav Mehta',
    jobPosition: 'VP of Human Resources',
    email: 'admin@dayflow.com',
    mobile: '+91 98200 12345',
    company: 'Dayflow India',
    department: 'Human Resources',
    manager: 'Board of Directors',
    location: 'Mumbai, Maharashtra',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=250&auto=format&fit=crop&q=80',
    status: 'present',
    resume: {
      about: 'Strategic HR Vice President with 12+ years of leadership in corporate talent development, compensation design, and HR automation across India.',
      skills: ['Talent Strategy', 'Indian Labor Laws', 'HR Operations', 'Payroll & Compliance', 'Leadership'],
      certifications: [
        { title: 'SHRM Senior Certified Professional (SHRM-SCP)', issuer: 'SHRM India', date: '2021-04-15' },
        { title: 'Certified Payroll & Statutory Compliance Specialist', issuer: 'NHRDN', date: '2019-11-10' },
      ],
    },
    privateInfo: {
      dateOfBirth: '1988-06-14',
      address: 'B-402, Seawood Towers, Bandra West, Mumbai, MH 400050',
      personalEmail: 'aarav.mehta.hr@gmail.com',
      gender: 'Male',
      maritalStatus: 'Married',
      dateOfJoining: '2020-01-15',
      bankName: 'HDFC Bank',
      accountNumber: '•••••••• 4892',
      ifsc: 'HDFC0000128',
      pan: 'ABCDE1234F',
      uan: '100928374615',
    },
    salaryInfo: calculateSalaryDetails(125000),
  },
  {
    id: 'emp_1001',
    employeeId: 'DFPRSH20260002',
    loginId: 'DFPRSH20260002',
    name: 'Priya Sharma',
    jobPosition: 'Lead UI/UX Architect',
    email: 'priya.sharma@dayflow.com',
    mobile: '+91 98450 67890',
    company: 'Dayflow India',
    department: 'Design & Product',
    manager: 'Aarav Mehta',
    location: 'Bengaluru, Karnataka',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=80',
    status: 'present',
    resume: {
      about: 'Passionate Design System Lead creating modern enterprise UI, clean component architectures, and human-centered design experiences.',
      skills: ['Figma Architecture', 'React Systems', 'Design Tokens', 'User Research', 'Clean UI'],
      certifications: [
        { title: 'NN/g Certified UX Master', issuer: 'Nielsen Norman Group', date: '2022-08-20' },
        { title: 'Certified Interaction Designer', issuer: 'IxDA', date: '2020-03-12' },
      ],
    },
    privateInfo: {
      dateOfBirth: '1993-11-22',
      address: '142, 8th Main, Indiranagar 1st Stage, Bengaluru, KA 560038',
      personalEmail: 'priya.sharma.design@gmail.com',
      gender: 'Female',
      maritalStatus: 'Single',
      dateOfJoining: '2021-06-01',
      bankName: 'ICICI Bank',
      accountNumber: '•••••••• 8821',
      ifsc: 'ICIC0000412',
      pan: 'PSHJK9921K',
      uan: '101293847561',
    },
    salaryInfo: calculateSalaryDetails(85000),
  },
  {
    id: 'emp_1002',
    employeeId: 'DFROVE20260003',
    loginId: 'DFROVE20260003',
    name: 'Rohan Verma',
    jobPosition: 'Senior Full Stack Engineer',
    email: 'rohan.verma@dayflow.com',
    mobile: '+91 97110 54321',
    company: 'Dayflow India',
    department: 'Engineering',
    manager: 'Aarav Mehta',
    location: 'Hyderabad, Telangana',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80',
    status: 'present',
    resume: {
      about: 'Full-Stack Software Architect specializing in TypeScript, Node.js microservices, distributed databases, and high-concurrency systems.',
      skills: ['TypeScript', 'Node.js', 'React', 'PostgreSQL', 'System Architecture'],
      certifications: [
        { title: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: '2021-01-10' },
      ],
    },
    privateInfo: {
      dateOfBirth: '1991-04-18',
      address: 'Flat 502, Silicon Heights, HITEC City, Hyderabad, TS 500081',
      personalEmail: 'rohan.verma.dev@gmail.com',
      gender: 'Male',
      maritalStatus: 'Married',
      dateOfJoining: '2021-09-15',
      bankName: 'Axis Bank',
      accountNumber: '•••••••• 3390',
      ifsc: 'UTIB0000912',
      pan: 'RVERN7723L',
      uan: '100882736412',
    },
    salaryInfo: calculateSalaryDetails(95000),
  },
  {
    id: 'emp_1003',
    employeeId: 'DFANDE20260004',
    loginId: 'DFANDE20260004',
    name: 'Ananya Deshmukh',
    jobPosition: 'HR Business Partner',
    email: 'ananya.deshmukh@dayflow.com',
    mobile: '+91 99200 43210',
    company: 'Dayflow India',
    department: 'Human Resources',
    manager: 'Aarav Mehta',
    location: 'Pune, Maharashtra',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
    status: 'leave',
    resume: {
      about: 'Dedicated HR Partner driving employee engagement, performance optimization, compliance, and inclusive workplace culture.',
      skills: ['Employee Engagement', 'Performance Management', 'HR Analytics', 'Conflict Resolution'],
      certifications: [
        { title: 'PHR Professional in Human Resources', issuer: 'HRCI', date: '2019-05-18' },
      ],
    },
    privateInfo: {
      dateOfBirth: '1995-02-09',
      address: '701, Pride Purple Enclave, Aundh, Pune, MH 411007',
      personalEmail: 'ananya.deshmukh.hr@gmail.com',
      gender: 'Female',
      maritalStatus: 'Single',
      dateOfJoining: '2022-03-01',
      bankName: 'Kotak Mahindra Bank',
      accountNumber: '•••••••• 1928',
      ifsc: 'KKBK0001720',
      pan: 'ANDES5512M',
      uan: '100448372619',
    },
    salaryInfo: calculateSalaryDetails(72000),
  },
  {
    id: 'emp_1004',
    employeeId: 'DFVIPA20260005',
    loginId: 'DFVIPA20260005',
    name: 'Vikram Patel',
    jobPosition: 'Financial Analyst',
    email: 'vikram.patel@dayflow.com',
    mobile: '+91 98100 34567',
    company: 'Dayflow India',
    department: 'Finance',
    manager: 'Aarav Mehta',
    location: 'Gurugram, Delhi NCR',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80',
    status: 'absent',
    resume: {
      about: 'Data-driven financial analyst managing corporate budgeting, financial forecasting, and statutory payroll accounting accuracy.',
      skills: ['Financial Modeling', 'Corporate Budgeting', 'Excel & SQL', 'Payroll Accounting', 'Valuation'],
      certifications: [
        { title: 'CFA Charterholder', issuer: 'CFA Institute', date: '2020-09-12' },
      ],
    },
    privateInfo: {
      dateOfBirth: '1992-08-30',
      address: 'Tower 3, DLF Phase 5, Gurugram, HR 122002',
      personalEmail: 'vikram.patel.fin@gmail.com',
      gender: 'Male',
      maritalStatus: 'Single',
      dateOfJoining: '2022-07-15',
      bankName: 'State Bank of India',
      accountNumber: '•••••••• 7712',
      ifsc: 'SBIN0000691',
      pan: 'VPATM1124P',
      uan: '100773645129',
    },
    salaryInfo: calculateSalaryDetails(78000),
  },
  {
    id: 'emp_1005',
    employeeId: 'DFKANA20260006',
    loginId: 'DFKANA20260006',
    name: 'Kavya Nair',
    jobPosition: 'Growth Marketing Manager',
    email: 'kavya.nair@dayflow.com',
    mobile: '+91 94440 98765',
    company: 'Dayflow India',
    department: 'Growth & Marketing',
    manager: 'Aarav Mehta',
    location: 'Chennai, Tamil Nadu',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=250&auto=format&fit=crop&q=80',
    status: 'present',
    resume: {
      about: 'Performance marketing strategist managing digital acquisition campaigns, brand positioning, and B2B growth marketing funnel.',
      skills: ['Digital Marketing', 'Brand Strategy', 'Funnel Analytics', 'SEO & Performance Ads'],
      certifications: [
        { title: 'Google Certified Digital Marketing Master', issuer: 'Google', date: '2021-10-15' },
      ],
    },
    privateInfo: {
      dateOfBirth: '1994-05-12',
      address: '24, Nungambakkam High Road, Chennai, TN 600034',
      personalEmail: 'kavya.nair.marketing@gmail.com',
      gender: 'Female',
      maritalStatus: 'Married',
      dateOfJoining: '2022-10-01',
      bankName: 'HDFC Bank',
      accountNumber: '•••••••• 9102',
      ifsc: 'HDFC0000240',
      pan: 'KNAIR3345Q',
      uan: '100994433221',
    },
    salaryInfo: calculateSalaryDetails(74000),
  },
];

const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att_101',
    employeeId: 'DFPRSH20260002',
    employeeName: 'Priya Sharma',
    date: new Date().toISOString().split('T')[0],
    checkIn: '09:00:15',
    checkOut: '17:30:45',
    workHours: 8.5,
    extraHours: 0.5,
    status: 'present',
  },
  {
    id: 'att_102',
    employeeId: 'DFROVE20260003',
    employeeName: 'Rohan Verma',
    date: new Date().toISOString().split('T')[0],
    checkIn: '08:45:00',
    checkOut: '17:15:00',
    workHours: 8.5,
    extraHours: 0.5,
    status: 'present',
  },
  {
    id: 'att_103',
    employeeId: 'DFAAME20260001',
    employeeName: 'Aarav Mehta',
    date: new Date().toISOString().split('T')[0],
    checkIn: '08:30:10',
    checkOut: '18:00:00',
    workHours: 9.5,
    extraHours: 1.5,
    status: 'present',
  },
  {
    id: 'att_104',
    employeeId: 'DFANDE20260004',
    employeeName: 'Ananya Deshmukh',
    date: new Date().toISOString().split('T')[0],
    checkIn: '-',
    checkOut: '-',
    workHours: 0,
    extraHours: 0,
    status: 'leave',
  },
  {
    id: 'att_105',
    employeeId: 'DFVIPA20260005',
    employeeName: 'Vikram Patel',
    date: new Date().toISOString().split('T')[0],
    checkIn: '-',
    checkOut: '-',
    workHours: 0,
    extraHours: 0,
    status: 'absent',
  },
];

const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'lv_201',
    employeeId: 'DFANDE20260004',
    employeeName: 'Ananya Deshmukh',
    leaveType: 'Paid Time Off',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    numberOfDays: 3,
    remarks: 'Attending family function and annual HR conference in Goa.',
    status: 'Approved',
    appliedDate: '2026-08-18',
  },
  {
    id: 'lv_202',
    employeeId: 'DFVIPA20260005',
    employeeName: 'Vikram Patel',
    leaveType: 'Sick Leave',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    numberOfDays: 2,
    remarks: 'High viral fever and doctor advised 2 days bed rest.',
    attachmentName: 'medical_certificate_vikram.pdf',
    attachmentUrl: 'blob:simulated-medical-cert',
    status: 'Pending',
    appliedDate: '2026-08-21',
  },
  {
    id: 'lv_203',
    employeeId: 'DFPRSH20260002',
    employeeName: 'Priya Sharma',
    leaveType: 'Paid Time Off',
    startDate: '2026-07-10',
    endDate: '2026-07-12',
    numberOfDays: 3,
    remarks: 'Personal travel.',
    status: 'Approved',
    appliedDate: '2026-07-01',
  },
];

class DBService {
  constructor() {
    this.initSeedData();
  }

  private initSeedData() {
    if (!localStorage.getItem(USERS_KEY)) {
      localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(EMPLOYEES_KEY)) {
      localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(INITIAL_EMPLOYEES));
    }
    if (!localStorage.getItem(ATTENDANCE_KEY)) {
      localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(INITIAL_ATTENDANCE));
    }
    if (!localStorage.getItem(LEAVE_KEY)) {
      localStorage.setItem(LEAVE_KEY, JSON.stringify(INITIAL_LEAVE_REQUESTS));
    }
  }

  // --- Users & Auth ---
  getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  }

  authenticate(loginInput: string, passwordHash: string): User | null {
    const users = this.getUsers();
    const cleanInput = loginInput.trim().toLowerCase();

    const found = users.find(
      (u: any) =>
        (u.email.toLowerCase() === cleanInput ||
          u.loginId.toLowerCase() === cleanInput ||
          u.employeeId.toLowerCase() === cleanInput) &&
        u.passwordHash === passwordHash
    );

    if (!found) return null;
    const { passwordHash: _, ...userObj } = found;
    return userObj;
  }

  // Register a New Admin/Company Account (Sign Up)
  registerCompanyAdmin(data: {
    companyName: string;
    name: string;
    email: string;
    phone: string;
    passwordHash: string;
  }): User {
    const users = this.getUsers();
    const employees = this.getEmployees();

    const serialNum = employees.length + 1;
    const generatedLoginId = generateWireframeLoginId(data.companyName, data.name, 2026, serialNum);
    const userId = `usr_${Date.now()}`;
    const empId = `emp_${Date.now()}`;

    const newUser: User & { passwordHash: string } = {
      id: userId,
      email: data.email,
      loginId: generatedLoginId,
      passwordHash: data.passwordHash,
      role: 'admin',
      employeeId: generatedLoginId,
      name: `${data.name} (Admin)`,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80',
      companyName: data.companyName,
    };

    const newEmployee: EmployeeProfile = {
      id: empId,
      employeeId: generatedLoginId,
      loginId: generatedLoginId,
      name: data.name,
      jobPosition: 'Company Founder / HR Admin',
      email: data.email,
      mobile: data.phone || '+91 98000 00000',
      company: data.companyName,
      department: 'Human Resources',
      manager: 'Executive Board',
      location: 'India HQ',
      avatarUrl: newUser.avatarUrl,
      status: 'present',
      resume: {
        about: `Company Administrator at ${data.companyName}.`,
        skills: ['HR Leadership', 'Strategic Management', 'Payroll Operations'],
        certifications: [],
      },
      privateInfo: {
        dateOfBirth: '1990-01-01',
        address: 'HQ Address, India',
        personalEmail: data.email,
        gender: 'Male',
        maritalStatus: 'Single',
        dateOfJoining: new Date().toISOString().split('T')[0],
        bankName: 'HDFC Bank',
        accountNumber: '•••••••• 9988',
        ifsc: 'HDFC0000100',
        pan: 'ADMIN9900P',
        uan: '100998877112',
      },
      salaryInfo: calculateSalaryDetails(150000),
    };

    users.unshift(newUser);
    employees.unshift(newEmployee);

    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees));

    const { passwordHash: _, ...userWithoutPass } = newUser;
    return userWithoutPass;
  }

  // --- Employees ---
  getEmployees(): EmployeeProfile[] {
    return JSON.parse(localStorage.getItem(EMPLOYEES_KEY) || '[]');
  }

  getEmployeeById(id: string): EmployeeProfile | undefined {
    return this.getEmployees().find((e) => e.id === id || e.employeeId === id || e.loginId === id);
  }

  generateNextEmployeeId(companyName: string = 'Dayflow India', fullName: string = 'New Employee'): string {
    const employees = this.getEmployees();
    const serial = employees.length + 1;
    return generateWireframeLoginId(companyName, fullName, 2026, serial);
  }

  addEmployee(data: Partial<EmployeeProfile>): EmployeeProfile {
    const employees = this.getEmployees();
    const compName = data.company || 'Dayflow India';
    const empName = data.name || 'New Employee';
    const newEmpId = this.generateNextEmployeeId(compName, empName);
    const id = `emp_${Date.now()}`;

    const newEmployee: EmployeeProfile = {
      id,
      employeeId: newEmpId,
      loginId: newEmpId,
      name: empName,
      jobPosition: data.jobPosition || 'Software Engineer',
      email: data.email || `${newEmpId.toLowerCase()}@dayflow.com`,
      mobile: data.mobile || '+91 98000 00000',
      company: compName,
      department: data.department || 'Technology',
      manager: data.manager || 'Aarav Mehta',
      location: data.location || 'Bengaluru, KA',
      avatarUrl:
        data.avatarUrl ||
        `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80`,
      status: 'present',
      resume: {
        about: data.resume?.about || 'New team member at Dayflow India.',
        skills: data.resume?.skills || ['Problem Solving', 'Teamwork'],
        certifications: [],
      },
      privateInfo: {
        dateOfBirth: data.privateInfo?.dateOfBirth || '1996-01-01',
        address: data.privateInfo?.address || 'MG Road, Bengaluru, KA 560001',
        personalEmail: data.privateInfo?.personalEmail || data.email || 'personal@example.com',
        gender: data.privateInfo?.gender || 'Male',
        maritalStatus: data.privateInfo?.maritalStatus || 'Single',
        dateOfJoining: new Date().toISOString().split('T')[0],
        bankName: 'HDFC Bank',
        accountNumber: '•••••••• 5521',
        ifsc: 'HDFC0009911',
        pan: 'NEWEMP9901A',
        uan: '100998877665',
      },
      salaryInfo: calculateSalaryDetails(data.salaryInfo?.monthlyWage || 70000),
    };

    employees.unshift(newEmployee);
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees));

    // Create matching user login account
    const users = this.getUsers();
    users.push({
      id: `usr_${id}`,
      email: newEmployee.email,
      loginId: newEmployee.loginId,
      passwordHash: 'emp123',
      role: 'employee',
      employeeId: newEmployee.employeeId,
      name: newEmployee.name,
      avatarUrl: newEmployee.avatarUrl,
      companyName: compName,
    });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    return newEmployee;
  }

  updateEmployeeProfile(id: string, updates: Partial<EmployeeProfile>): EmployeeProfile | null {
    const employees = this.getEmployees();
    const index = employees.findIndex((e) => e.id === id || e.employeeId === id || e.loginId === id);
    if (index === -1) return null;

    const updated = {
      ...employees[index],
      ...updates,
      resume: { ...employees[index].resume, ...updates.resume },
      privateInfo: { ...employees[index].privateInfo, ...updates.privateInfo },
      salaryInfo: updates.salaryInfo || employees[index].salaryInfo,
    };

    employees[index] = updated;
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees));
    return updated;
  }

  // --- Attendance ---
  getAttendance(employeeId?: string, date?: string): AttendanceRecord[] {
    const records: AttendanceRecord[] = JSON.parse(localStorage.getItem(ATTENDANCE_KEY) || '[]');
    return records.filter((r) => {
      if (employeeId && r.employeeId !== employeeId) return false;
      if (date && r.date !== date) return false;
      return true;
    });
  }

  getTodayRecord(employeeId: string): AttendanceRecord | undefined {
    const today = new Date().toISOString().split('T')[0];
    return this.getAttendance(employeeId, today)[0];
  }

  checkIn(employeeId: string, employeeName: string): AttendanceRecord {
    const today = new Date().toISOString().split('T')[0];
    const records: AttendanceRecord[] = JSON.parse(localStorage.getItem(ATTENDANCE_KEY) || '[]');

    const existingIdx = records.findIndex((r) => r.employeeId === employeeId && r.date === today);
    const nowStr = new Date().toLocaleTimeString('en-US', { hour12: false });

    if (existingIdx !== -1) {
      if (records[existingIdx].checkIn !== '-') {
        return records[existingIdx];
      }
      records[existingIdx].checkIn = nowStr;
      records[existingIdx].status = 'present';
    } else {
      const newRec: AttendanceRecord = {
        id: `att_${Date.now()}`,
        employeeId,
        employeeName,
        date: today,
        checkIn: nowStr,
        workHours: 0,
        extraHours: 0,
        status: 'present',
      };
      records.unshift(newRec);
    }

    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records));

    const emp = this.getEmployeeById(employeeId);
    if (emp) {
      this.updateEmployeeProfile(emp.id, { status: 'present' });
    }

    return this.getTodayRecord(employeeId)!;
  }

  checkOut(employeeId: string): AttendanceRecord | null {
    const today = new Date().toISOString().split('T')[0];
    const records: AttendanceRecord[] = JSON.parse(localStorage.getItem(ATTENDANCE_KEY) || '[]');
    const idx = records.findIndex((r) => r.employeeId === employeeId && r.date === today);

    if (idx === -1 || records[idx].checkIn === '-') return null;

    const nowStr = new Date().toLocaleTimeString('en-US', { hour12: false });
    records[idx].checkOut = nowStr;

    const [inH, inM, inS] = records[idx].checkIn.split(':').map(Number);
    const [outH, outM, outS] = nowStr.split(':').map(Number);

    const checkInMs = (inH * 3600 + inM * 60 + (inS || 0)) * 1000;
    const checkOutMs = (outH * 3600 + outM * 60 + (outS || 0)) * 1000;

    const elapsedHours = Math.max(0, (checkOutMs - checkInMs) / (1000 * 3600));
    const roundedWorkHours = parseFloat(elapsedHours.toFixed(2));
    const extraHours = Math.max(0, parseFloat((roundedWorkHours - 8).toFixed(2)));

    records[idx].workHours = roundedWorkHours;
    records[idx].extraHours = extraHours;

    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records));
    return records[idx];
  }

  // --- Leave Requests ---
  getLeaveRequests(employeeId?: string): LeaveRequest[] {
    const requests: LeaveRequest[] = JSON.parse(localStorage.getItem(LEAVE_KEY) || '[]');
    if (employeeId) {
      return requests.filter((r) => r.employeeId === employeeId);
    }
    return requests;
  }

  getLeaveBalance(employeeId: string): LeaveBalance {
    const requests = this.getLeaveRequests(employeeId).filter((r) => r.status === 'Approved');

    let ptoUsed = 0;
    let sickUsed = 0;
    let unpaidUsed = 0;

    requests.forEach((r) => {
      if (r.leaveType === 'Paid Time Off') ptoUsed += r.numberOfDays;
      if (r.leaveType === 'Sick Leave') sickUsed += r.numberOfDays;
      if (r.leaveType === 'Unpaid Leave') unpaidUsed += r.numberOfDays;
    });

    return {
      paidTimeOff: { total: 18, used: ptoUsed },
      sickLeave: { total: 12, used: sickUsed },
      unpaidLeave: { total: 10, used: unpaidUsed },
    };
  }

  applyLeave(data: {
    employeeId: string;
    employeeName: string;
    leaveType: any;
    startDate: string;
    endDate: string;
    remarks: string;
    attachmentName?: string;
    attachmentUrl?: string;
  }): LeaveRequest {
    const requests = this.getLeaveRequests();

    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const numberOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newRequest: LeaveRequest = {
      id: `lv_${Date.now()}`,
      employeeId: data.employeeId,
      employeeName: data.employeeName,
      leaveType: data.leaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      numberOfDays: isNaN(numberOfDays) ? 1 : numberOfDays,
      remarks: data.remarks,
      attachmentName: data.attachmentName,
      attachmentUrl: data.attachmentUrl,
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0],
    };

    requests.unshift(newRequest);
    localStorage.setItem(LEAVE_KEY, JSON.stringify(requests));
    return newRequest;
  }

  updateLeaveStatus(leaveId: string, status: 'Approved' | 'Rejected', rejectionReason?: string): LeaveRequest | null {
    const requests = this.getLeaveRequests();
    const idx = requests.findIndex((r) => r.id === leaveId);
    if (idx === -1) return null;

    requests[idx].status = status;
    if (rejectionReason) {
      requests[idx].rejectionReason = rejectionReason;
    }

    localStorage.setItem(LEAVE_KEY, JSON.stringify(requests));

    if (status === 'Approved') {
      const emp = this.getEmployeeById(requests[idx].employeeId);
      if (emp) {
        this.updateEmployeeProfile(emp.id, { status: 'leave' });
      }
    }

    return requests[idx];
  }

  // --- Password Management ---
  changePassword(emailOrLoginId: string, currentPass: string, newPass: string): boolean {
    const users = this.getUsers();
    const cleanInput = emailOrLoginId.trim().toLowerCase();

    const idx = users.findIndex(
      (u: any) =>
        (u.email.toLowerCase() === cleanInput || u.loginId.toLowerCase() === cleanInput) &&
        u.passwordHash === currentPass
    );
    if (idx === -1) return false;

    users[idx].passwordHash = newPass;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  }
}

export const db = new DBService();
