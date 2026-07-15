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
  LogOut,
  HeartPulse
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onLogout?: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, theme, toggleTheme, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: Activity, color: 'text-teal-500', glow: 'shadow-glow-teal' },
    { id: 'doctors', label: 'Doctor Workspace', icon: UserCheck, color: 'text-emerald-500', glow: 'shadow-glow-teal' },
    { id: 'patients', label: 'Patient Directory', icon: Users, color: 'text-blue-500', glow: 'shadow-glow-indigo' },
    { id: 'appointments', label: 'Appointments', icon: Calendar, color: 'text-indigo-500', glow: 'shadow-glow-indigo' },
    { id: 'billing', label: 'Billing & Invoices', icon: CreditCard, color: 'text-purple-500', glow: 'shadow-glow-indigo' },
    { id: 'reports', label: 'Reports & Logs', icon: BarChart3, color: 'text-rose-500', glow: 'shadow-glow-teal' },
  ];

  return (
    <aside className="w-72 border-r border-border/80 flex flex-col justify-between glass-panel transition-all duration-300 z-10 select-none">
      <div>
        {/* Logo Brand Header */}
        <div className="p-6 border-b border-border/50 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-glow-teal animate-heartbeat">
            <HeartPulse className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg leading-none tracking-tight bg-gradient-to-r from-teal-500 to-emerald-400 bg-clip-text text-transparent uppercase">
              AegisMed
            </h1>
            <span className="text-[9px] uppercase tracking-widest font-extrabold text-muted-foreground block mt-1">
              Clinical Portal v1.0
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="p-4 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 group relative overflow-hidden ${
                  isActive 
                    ? 'bg-gradient-to-r from-teal-500/10 to-teal-500/5 text-primary border-l-2 border-primary shadow-sm shadow-primary/5' 
                    : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                }`}
              >
                {/* Active Indicator Back-gradient highlight */}
                {isActive && (
                  <span className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent pointer-events-none" />
                )}
                
                <Icon className={`h-4.5 w-4.5 transition-all duration-300 group-hover:scale-110 ${
                  isActive ? 'text-primary drop-shadow-[0_0_5px_rgba(13,148,136,0.5)]' : 'text-muted-foreground group-hover:text-foreground'
                }`} />
                <span>{item.label}</span>
                
                {isActive && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary shadow-glow-teal animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-border/50 space-y-4">
        {/* User Card */}
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/20 transition-all duration-200">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-teal-500 to-indigo-500 flex items-center justify-center font-extrabold text-xs text-white shadow-glow-teal">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold tracking-wide truncate">Admin User</p>
            <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold truncate">Super Admin</p>
          </div>
          <button 
            onClick={onLogout}
            className="p-2 text-muted-foreground hover:text-rose-500 rounded-lg hover:bg-rose-500/10 transition-all"
            title="Exit Console"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
