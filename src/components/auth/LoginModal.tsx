import React, { useState } from 'react';
import {
  Layers,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Building,
  User as UserIcon,
  Upload,
  CheckCircle2,
  Briefcase,
} from 'lucide-react';
import type { User, Role } from '../../types';
import { db, generateWireframeLoginId } from '../../services/db';

interface LoginModalProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  // Sign In State
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Sign Up State (Company / Employee / Manager Creation as per Wireframe)
  const [signUpForm, setSignUpForm] = useState({
    companyName: '',
    name: '',
    email: '',
    phone: '',
    post: 'HR Manager', // Default Post
    role: 'admin' as Role, // Default Role
    password: '',
    confirmPassword: '',
    companyLogo: '',
  });
  const [showSignUpPass, setShowSignUpPass] = useState(false);
  const [showSignUpConfirmPass, setShowSignUpConfirmPass] = useState(false);
  const [signUpSuccessMsg, setSignUpSuccessMsg] = useState<{ loginId: string; name: string } | null>(null);

  // Calculated Preview ID for Sign Up
  const previewLoginId = signUpForm.companyName && signUpForm.name
    ? generateWireframeLoginId(signUpForm.companyName, signUpForm.name)
    : '';

  // Available Post Options
  const POST_OPTIONS = [
    { label: 'HR / Admin', role: 'admin' as Role },
    { label: 'HR Manager', role: 'admin' as Role },
    { label: 'General Manager', role: 'admin' as Role },
    { label: 'Software Engineer', role: 'employee' as Role },
    { label: 'UI/UX Designer', role: 'employee' as Role },
    { label: 'Financial Analyst', role: 'employee' as Role },
    { label: 'Marketing Manager', role: 'employee' as Role },
    { label: 'Employee / Staff', role: 'employee' as Role },
  ];

  // Handle Post Change
  const handlePostChange = (selectedPost: string) => {
    const matched = POST_OPTIONS.find((p) => p.label === selectedPost);
    const assignedRole = matched ? matched.role : selectedPost.toLowerCase().includes('hr') || selectedPost.toLowerCase().includes('admin') ? 'admin' : 'employee';
    setSignUpForm({
      ...signUpForm,
      post: selectedPost,
      role: assignedRole,
    });
  };

  // Handle Sign In Submit
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const authenticatedUser = db.authenticate(loginInput, password);
      setLoading(false);

      if (authenticatedUser) {
        onLoginSuccess(authenticatedUser);
      } else {
        setError('Invalid credentials. Check your Login ID / Email and password.');
      }
    }, 400);
  };

  // Handle Sign Up Submit
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (signUpForm.password !== signUpForm.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (signUpForm.password.length < 5) {
      setError('Password must be at least 5 characters long.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const newUser = db.registerCompanyAccount({
        companyName: signUpForm.companyName,
        name: signUpForm.name,
        email: signUpForm.email,
        phone: signUpForm.phone,
        post: signUpForm.post,
        role: signUpForm.role,
        passwordHash: signUpForm.password,
      });

      setLoading(false);
      setSignUpSuccessMsg({ loginId: newUser.loginId, name: newUser.name });

      // Automatically sign in the newly registered user after 1.5 seconds
      setTimeout(() => {
        onLoginSuccess(newUser);
      }, 1500);
    }, 500);
  };

  // Quick Demo Login Handler
  const handleQuickLogin = (presetLoginId: string, presetPass: string) => {
    setLoginInput(presetLoginId);
    setPassword(presetPass);
    setError('');
    setLoading(true);

    setTimeout(() => {
      const user = db.authenticate(presetLoginId, presetPass);
      setLoading(false);
      if (user) onLoginSuccess(user);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#090d16]/90">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-[#161b22] border border-[#30363d] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Branding Header */}
        <div className="relative p-6 text-center border-b border-[#30363d] bg-[#0d1117]">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-0.5 shadow-xl shadow-purple-950/50">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#0d1117]">
              <Layers className="h-7 w-7 text-purple-400" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Dayflow HRMS</h2>
          <p className="mt-0.5 text-xs text-slate-400">Human Resource Management System</p>
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {signUpSuccessMsg && (
            <div className="mb-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-xs text-emerald-300 space-y-1">
              <div className="flex items-center gap-2 font-bold text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> Account Registered Successfully!
              </div>
              <p>Generated Login ID: <span className="font-mono font-bold text-white text-sm">{signUpSuccessMsg.loginId}</span></p>
              <p className="text-[11px] text-slate-400">Redirecting to your portal...</p>
            </div>
          )}

          {/* MODE 1: SIGN IN PAGE */}
          {mode === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Login ID / Email :-</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    placeholder="e.g. DFPRSH20260002 or admin@dayflow.com"
                    className="w-full rounded-xl bg-[#0d1117] border border-[#30363d] py-2.5 pl-10 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Password :-</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl bg-[#0d1117] border border-[#30363d] py-2.5 pl-10 pr-10 text-xs text-slate-100 placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-purple-950/50 transition-all uppercase tracking-wider disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setMode('signup');
                  }}
                  className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
                >
                  Don't have an Account? Sign Up
                </button>
              </div>
            </form>
          ) : (
            /* MODE 2: SIGN UP PAGE (With Post / Designation Selector) */
            <form onSubmit={handleSignUp} className="space-y-3 text-xs">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <label className="block text-slate-300 font-semibold mb-1">Company Name :-</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={signUpForm.companyName}
                      onChange={(e) => setSignUpForm({ ...signUpForm, companyName: e.target.value })}
                      placeholder="e.g. Odoo India or Dayflow"
                      className="w-full rounded-xl bg-[#0d1117] border border-[#30363d] py-2 pl-9 pr-3 text-xs text-slate-100 placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="shrink-0 pt-5">
                  <label className="cursor-pointer flex items-center gap-1 px-3 py-2 rounded-xl bg-purple-950/60 border border-purple-800 text-[11px] font-semibold text-purple-300 hover:bg-purple-900/50 transition-colors">
                    <Upload className="h-3.5 w-3.5" /> Upload Logo
                    <input type="file" accept="image/*" className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Name :-</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={signUpForm.name}
                    onChange={(e) => setSignUpForm({ ...signUpForm, name: e.target.value })}
                    placeholder="Full Name"
                    className="w-full rounded-xl bg-[#0d1117] border border-[#30363d] py-2 pl-9 pr-3 text-xs text-slate-100 placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Post / Designation Field */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Post / Role :-</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                    <select
                      value={signUpForm.post}
                      onChange={(e) => handlePostChange(e.target.value)}
                      className="w-full rounded-xl bg-[#0d1117] border border-[#30363d] py-2 pl-9 pr-3 text-xs text-slate-100 focus:border-purple-500 focus:outline-none"
                    >
                      {POST_OPTIONS.map((opt) => (
                        <option key={opt.label} value={opt.label} className="bg-[#161b22] text-white">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Portal Access Level :-</label>
                  <select
                    value={signUpForm.role}
                    onChange={(e) => setSignUpForm({ ...signUpForm, role: e.target.value as Role })}
                    className="w-full rounded-xl bg-[#0d1117] border border-[#30363d] py-2 px-3 text-xs text-slate-100 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="admin" className="bg-[#161b22] text-white">Admin / HR (Full Access)</option>
                    <option value="employee" className="bg-[#161b22] text-white">Employee (Personal Portal)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email :-</label>
                  <input
                    type="email"
                    required
                    value={signUpForm.email}
                    onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                    placeholder="user@company.com"
                    className="w-full rounded-xl bg-[#0d1117] border border-[#30363d] py-2 px-3 text-xs text-slate-100 placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone :-</label>
                  <input
                    type="text"
                    value={signUpForm.phone}
                    onChange={(e) => setSignUpForm({ ...signUpForm, phone: e.target.value })}
                    placeholder="+91 98000 00000"
                    className="w-full rounded-xl bg-[#0d1117] border border-[#30363d] py-2 px-3 text-xs text-slate-100 placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Password :-</label>
                  <div className="relative">
                    <input
                      type={showSignUpPass ? 'text' : 'password'}
                      required
                      value={signUpForm.password}
                      onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full rounded-xl bg-[#0d1117] border border-[#30363d] py-2 pl-3 pr-8 text-xs text-slate-100 focus:border-purple-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPass(!showSignUpPass)}
                      className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
                    >
                      {showSignUpPass ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Confirm Password :-</label>
                  <div className="relative">
                    <input
                      type={showSignUpConfirmPass ? 'text' : 'password'}
                      required
                      value={signUpForm.confirmPassword}
                      onChange={(e) => setSignUpForm({ ...signUpForm, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full rounded-xl bg-[#0d1117] border border-[#30363d] py-2 pl-3 pr-8 text-xs text-slate-100 focus:border-purple-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpConfirmPass(!showSignUpConfirmPass)}
                      className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
                    >
                      {showSignUpConfirmPass ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Wireframe Generated Login ID Preview Box */}
              {previewLoginId && (
                <div className="p-2.5 rounded-xl bg-[#0d1117] border border-purple-800/40 text-[11px] flex items-center justify-between text-slate-300">
                  <span>Auto-Generated Login ID:</span>
                  <span className="font-mono font-bold text-purple-400">{previewLoginId}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-purple-950/50 transition-all uppercase tracking-wider disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  'Sign Up'
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setMode('signin');
                  }}
                  className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
                >
                  Already have an account? Sign In
                </button>
              </div>
            </form>
          )}

          {/* Quick Demo Accounts */}
          <div className="mt-6 pt-5 border-t border-[#30363d]">
            <p className="text-center text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
              Quick Test Logins (Wireframe Login IDs)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('DFAAME20260001', 'admin123')}
                className="flex items-center gap-2 p-2 rounded-xl bg-[#0d1117] border border-[#30363d] hover:border-purple-500/50 text-left transition-colors group"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-600 text-white shrink-0">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <div className="truncate text-[11px]">
                  <p className="font-bold text-purple-200 group-hover:text-white truncate">Aarav Mehta</p>
                  <p className="text-[10px] text-slate-400 font-mono">DFAAME20260001</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('DFPRSH20260002', 'emp123')}
                className="flex items-center gap-2 p-2 rounded-xl bg-[#0d1117] border border-[#30363d] hover:border-cyan-500/50 text-left transition-colors group"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-600 text-white shrink-0">
                  <UserCheck className="h-3.5 w-3.5" />
                </div>
                <div className="truncate text-[11px]">
                  <p className="font-bold text-cyan-200 group-hover:text-white truncate">Priya Sharma</p>
                  <p className="text-[10px] text-slate-400 font-mono">DFPRSH20260002</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
