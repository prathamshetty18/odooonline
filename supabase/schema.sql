-- Supabase Database Schema for Dayflow HRMS

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  login_id TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'employee',
  employee_id TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  company_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. EMPLOYEES TABLE
CREATE TABLE IF NOT EXISTS public.employees (
  id TEXT PRIMARY KEY,
  employee_id TEXT UNIQUE NOT NULL,
  login_id TEXT NOT NULL,
  name TEXT NOT NULL,
  job_position TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT,
  company TEXT NOT NULL,
  department TEXT NOT NULL,
  manager TEXT,
  location TEXT,
  avatar_url TEXT,
  status TEXT DEFAULT 'present',
  resume JSONB DEFAULT '{}'::jsonb,
  private_info JSONB DEFAULT '{}'::jsonb,
  salary_info JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS public.attendance (
  id TEXT PRIMARY KEY,
  employee_id TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  date DATE NOT NULL,
  check_in TEXT,
  check_out TEXT,
  work_hours NUMERIC DEFAULT 0,
  extra_hours NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'present',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. LEAVE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.leave_requests (
  id TEXT PRIMARY KEY,
  employee_id TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  leave_type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  number_of_days INT NOT NULL,
  remarks TEXT,
  attachment_name TEXT,
  attachment_url TEXT,
  status TEXT DEFAULT 'Pending',
  applied_date DATE NOT NULL,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

-- Allow Public Access Policy for Demo/Testing
CREATE POLICY "Public Read Users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Public Insert Users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Users" ON public.users FOR UPDATE USING (true);

CREATE POLICY "Public Read Employees" ON public.employees FOR SELECT USING (true);
CREATE POLICY "Public Insert Employees" ON public.employees FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Employees" ON public.employees FOR UPDATE USING (true);

CREATE POLICY "Public Read Attendance" ON public.attendance FOR SELECT USING (true);
CREATE POLICY "Public Insert Attendance" ON public.attendance FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Attendance" ON public.attendance FOR UPDATE USING (true);

CREATE POLICY "Public Read Leave" ON public.leave_requests FOR SELECT USING (true);
CREATE POLICY "Public Insert Leave" ON public.leave_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Leave" ON public.leave_requests FOR UPDATE USING (true);
