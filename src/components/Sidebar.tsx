'use client';

import React from 'react';
import { 
  Activity, 
  UserCheck, 
  Users, 
  Calendar, 
  CreditCard, 
  BarChart3, 
  Stethoscope,
  Sun,
  Moon,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, theme, toggleTheme }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: Activity, color: 'text-teal-500' },
    { id: 'doctors', label: 'Doctor Workspace', icon: UserCheck, color: 'text-emerald-500' },
    { id: 'patients', label: 'Patient Directory', icon: Users, color: 'text-blue-500' },
    { id: 'appointments', label: 'Appointments', icon: Calendar, color: 'text-indigo-500' },
    { id: 'billing', label: 'Billing & Invoices', icon: CreditCard, color: 'text-purple-500' },
    { id: 'reports', label: 'Reports & Logs', icon: BarChart3, color: 'text-rose-500' },
  ];

  return (
    <aside className="w-72 border-r border-border flex flex-col justify-between glass-panel transition-all duration-300 z-10">
      <div>
        {/* Logo Brand Header */}
        <div className="p-6 border-b border-border flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
              AegisMed
            </h1>
            <span className="text-[10px] uppercase tracking-wider font-semibold opacity-60">
              Hospital System
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-primary/10 text-primary border-l-4 border-primary shadow-sm' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer (Theme Toggling & Profile Details) */}
      <div className="p-4 border-t border-border space-y-4">
        {/* Theme Toggle Widget */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/60 border border-border/50">
          <span className="text-xs font-semibold px-2">Theme Mode</span>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-card border border-border shadow-sm hover:bg-muted hover:text-primary transition-all duration-200"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-500" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-500" />
            )}
          </button>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 p-2">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-teal-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-sm">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">Admin User</p>
            <p className="text-[10px] text-muted-foreground truncate">Super Administrator</p>
          </div>
          <button 
            className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
            title="Log Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
