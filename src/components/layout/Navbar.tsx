import React, { useState } from 'react';
import {
  Users,
  Clock,
  Calendar,
  DollarSign,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Layers,
} from 'lucide-react';
import type { User } from '../../types';

interface NavbarProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  onSelectMyProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onLogout,
  onSelectMyProfile,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'timeoff', label: 'Time Off', icon: Calendar },
    { id: 'salary', label: 'Salary', icon: DollarSign },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#30363d] bg-[#161b22]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex cursor-pointer items-center gap-3 group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-purple-900/30 group-hover:scale-105 transition-transform duration-200">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0d1117]">
                <Layers className="h-5 w-5 text-purple-400 group-hover:text-cyan-300 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-white font-sans">
                  Day<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">flow</span>
                </span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  HRMS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wider">ENTERPRISE WORKFORCE</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#21262d]'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Profile Avatar Controls */}
        <div className="flex items-center gap-3">
          {currentUser && (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-[#21262d] border border-transparent hover:border-[#30363d] transition-all duration-200"
              >
                <div className="relative">
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-purple-500/40"
                  />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0d1117]" />
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-xs font-semibold text-slate-200 leading-tight">{currentUser.name}</p>
                  <p className="text-[11px] text-purple-300 font-mono font-bold">{currentUser.loginId || currentUser.employeeId}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              {/* User Dropdown Menu */}
              {dropdownOpen && (
                <div
                  onMouseLeave={() => setDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-60 rounded-2xl bg-[#161b22] border border-[#30363d] shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-4 py-2.5 border-b border-[#30363d]">
                    <p className="text-sm font-semibold text-white">{currentUser.name}</p>
                    <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#0d1117] text-purple-300 border border-purple-500/30">
                        ID: {currentUser.loginId || currentUser.employeeId}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          currentUser.role === 'admin'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        }`}
                      >
                        {currentUser.role}
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onSelectMyProfile();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-purple-600/20 flex items-center gap-2.5 transition-colors"
                    >
                      <UserIcon className="h-4 w-4 text-purple-400" />
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        setActiveTab('attendance');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-purple-600/20 flex items-center gap-2.5 transition-colors"
                    >
                      <Clock className="h-4 w-4 text-cyan-400" />
                      My Attendance
                    </button>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        setActiveTab('timeoff');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-purple-600/20 flex items-center gap-2.5 transition-colors"
                    >
                      <Calendar className="h-4 w-4 text-indigo-400" />
                      Apply Leave
                    </button>
                  </div>

                  <div className="border-t border-[#30363d] pt-1 mt-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 flex items-center gap-2.5 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="flex md:hidden overflow-x-auto border-t border-[#30363d] bg-[#0d1117] px-2 py-2 gap-1 no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                isActive ? 'bg-purple-600 text-white' : 'text-slate-400 bg-[#161b22]'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
