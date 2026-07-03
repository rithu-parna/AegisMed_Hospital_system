'use client';

import React, { useState, useEffect } from 'react';
import { Doctor, Patient, Appointment, Invoice, MedicalRecord } from '../types/hospital';
import { getInitialHMSData, saveHMSData } from '../utils/mockData';

// Component Views
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import DoctorDashboard from '../components/DoctorDashboard';
import PatientManager from '../components/PatientManager';
import AppointmentManager from '../components/AppointmentManager';
import BillingManager from '../components/BillingManager';
import ReportManager from '../components/ReportManager';

// Icons
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Activity, 
  Stethoscope, 
  Heart, 
  Clock, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';

export default function HMSHome() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Core Data States
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([]);

  // Hydrate Data on Mount
  useEffect(() => {
    const data = getInitialHMSData();
    setDoctors(data.doctors);
    setPatients(data.patients);
    setAppointments(data.appointments);
    setInvoices(data.invoices);
    setRecords(data.records);

    // Read stored theme preference
    const savedTheme = localStorage.getItem('hms_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    }

    setMounted(true);
  }, []);

  // Sync Data to LocalStorage on Updates
  useEffect(() => {
    if (!mounted) return;
    saveHMSData({
      doctors,
      patients,
      appointments,
      invoices,
      records
    });
  }, [doctors, patients, appointments, invoices, records, mounted]);

  // Apply Theme class
  useEffect(() => {
    if (!mounted) return;
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('hms_theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const updateDoctorStatus = (docId: string, status: Doctor['status']) => {
    setDoctors(prev => prev.map(doc => doc.id === docId ? { ...doc, status } : doc));
  };

  if (!mounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-teal-500 font-semibold gap-3">
        <Activity className="h-6 w-6 animate-pulse" />
        <span className="text-sm uppercase tracking-widest">Initializing AegisMed HMS...</span>
      </div>
    );
  }

  // Dashboard Overview Metrics
  const totalOutstanding = invoices.reduce((acc, inv) => acc + (inv.totalAmount - inv.paidAmount), 0);
  const totalRevenue = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  
  // Weekly visits count Sparkline mockup data
  const patientVisitsSparkline = [45, 60, 52, 70, 85, 110, 150];
  const revenueSparkline = [12000, 14000, 11500, 16800, 18500, 22000, 26000];
  const activeStaffSparkline = [5, 6, 6, 5, 6, 6, 6];

  return (
    <div className="flex h-screen overflow-hidden bg-background bg-grid-pattern">
      {/* Background glowing gradients for premium aesthetics */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none animate-pulse-glow" />

      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header Dashboard Area */}
        <header className="h-18 px-8 border-b border-border flex items-center justify-between bg-card/10 backdrop-blur-md z-10 no-print">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-semibold">HMS Workspace</span>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-bold capitalize text-primary">
              {activeTab === 'dashboard' ? 'General Dashboard' : activeTab.replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-6">
            {/* Live Date-Time Ticker */}
            <div className="text-right">
              <span className="text-xs font-semibold text-muted-foreground block leading-none mb-1">Clinic Status</span>
              <div className="flex items-center gap-1.5 justify-end">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Live Services Active</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Tab Body Panel */}
        <div className="flex-1 overflow-y-auto p-8 z-10">
          
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Top Banner Greeting */}
              <div className="flex justify-between items-center p-6 border border-primary/10 rounded-2xl bg-gradient-to-r from-teal-500/5 to-emerald-500/5 backdrop-blur-md">
                <div>
                  <h2 className="text-xl font-bold">Good Day, Administrator</h2>
                  <p className="text-xs text-muted-foreground mt-1">Here is a summary of the clinical wards, pending invoices, and active appointments for today.</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-lg shadow-primary/10">
                  <Heart className="h-5 w-5 animate-pulse" />
                </div>
              </div>

              {/* KPI Stat Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard
                  title="Total Patient Registry"
                  value={patients.length}
                  subtext="+12 new admissions this week"
                  icon={Users}
                  trend={{ value: '8.4%', type: 'up' }}
                  color="teal"
                  sparkline={patientVisitsSparkline}
                />
                <StatCard
                  title="Active Appointments"
                  value={appointments.filter(a => a.status === 'scheduled' || a.status === 'in-progress').length}
                  subtext="4 check-ups currently in lobby"
                  icon={Calendar}
                  trend={{ value: '14%', type: 'up' }}
                  color="indigo"
                  sparkline={activeStaffSparkline}
                />
                <StatCard
                  title="Total Revenue Collected"
                  value={`$${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                  subtext="Co-payments and claims combined"
                  icon={DollarSign}
                  trend={{ value: '23.1%', type: 'up' }}
                  color="emerald"
                  sparkline={revenueSparkline}
                />
                <StatCard
                  title="Outstanding Balances"
                  value={`$${totalOutstanding.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                  subtext="Pending insurance review claims"
                  icon={Clock}
                  trend={{ value: '5.2%', type: 'down' }}
                  color="rose"
                  sparkline={[9000, 8500, 9200, 7800, 8300, 7200, totalOutstanding]}
                />
              </div>

              {/* Daily Queue Overview & Doctors Grid Layout */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                
                {/* Active Doctors Roster */}
                <div className="xl:col-span-7 p-6 border border-border rounded-2xl bg-card/30 backdrop-blur-md">
                  <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                    <Stethoscope className="h-4.5 w-4.5 text-primary" />
                    <span>Clinic Ward Roster & Staff Availability</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {doctors.map((doc) => (
                      <div key={doc.id} className="p-4 rounded-xl border border-border bg-card/50 hover:bg-card transition-all duration-200 flex items-center gap-3">
                        <img 
                          src={doc.avatar} 
                          alt={doc.name} 
                          className="h-12 w-12 rounded-xl object-cover ring-2 ring-primary/10"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs truncate">{doc.name}</h4>
                          <p className="text-[10px] text-muted-foreground truncate">{doc.specialty}</p>
                          <span className={`inline-block text-[9px] font-bold px-2 py-0.25 rounded-full mt-1.5 uppercase ${
                            doc.status === 'available' ? 'bg-emerald-500/10 text-emerald-500' :
                            doc.status === 'busy' ? 'bg-amber-500/10 text-amber-500' :
                            doc.status === 'on-duty' ? 'bg-blue-500/10 text-blue-500' :
                            'bg-rose-500/10 text-rose-500'
                          }`}>
                            {doc.status.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Queue Summary panel */}
                <div className="xl:col-span-5 p-6 border border-border rounded-2xl bg-card/30 backdrop-blur-md flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                      <Clock className="h-4.5 w-4.5 text-primary" />
                      <span>Today&apos;s Lobby Feed</span>
                    </h3>
                    
                    <div className="space-y-3">
                      {appointments
                        .filter(a => a.status === 'scheduled' || a.status === 'in-progress')
                        .slice(0, 3)
                        .map((appt) => (
                          <div key={appt.id} className="flex justify-between items-center p-3 rounded-xl bg-muted/40 border border-border/50 text-xs">
                            <div>
                              <p className="font-bold">{appt.patientName}</p>
                              <p className="text-[10px] text-muted-foreground">Assigned to: {appt.doctorName}</p>
                            </div>
                            <span className="font-mono font-bold bg-card border border-border px-2.5 py-1 rounded text-[10px]">
                              {appt.time}
                            </span>
                          </div>
                        ))}
                      {appointments.filter(a => a.status === 'scheduled' || a.status === 'in-progress').length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-8 font-semibold">No patients currently in the lobby queue.</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('appointments')}
                    className="w-full mt-4 py-2 bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>Manage All Appointments</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: DOCTOR DASHBOARD */}
          {activeTab === 'doctors' && (
            <div className="animate-in fade-in duration-300">
              <DoctorDashboard
                doctors={doctors}
                patients={patients}
                appointments={appointments}
                records={records}
                setAppointments={setAppointments}
                setPatients={setPatients}
                setRecords={setRecords}
                updateDoctorStatus={updateDoctorStatus}
              />
            </div>
          )}

          {/* TAB 3: PATIENT DIRECTORY */}
          {activeTab === 'patients' && (
            <div className="animate-in fade-in duration-300">
              <PatientManager
                patients={patients}
                records={records}
                setPatients={setPatients}
              />
            </div>
          )}

          {/* TAB 4: APPOINTMENTS SCHEDULER */}
          {activeTab === 'appointments' && (
            <div className="animate-in fade-in duration-300">
              <AppointmentManager
                appointments={appointments}
                doctors={doctors}
                patients={patients}
                setAppointments={setAppointments}
              />
            </div>
          )}

          {/* TAB 5: BILLING AND INVOICES */}
          {activeTab === 'billing' && (
            <div className="animate-in fade-in duration-300">
              <BillingManager
                invoices={invoices}
                patients={patients}
                setInvoices={setInvoices}
              />
            </div>
          )}

          {/* TAB 6: REPORTS & LOGS */}
          {activeTab === 'reports' && (
            <div className="animate-in fade-in duration-300">
              <ReportManager
                doctors={doctors}
                patients={patients}
                appointments={appointments}
                invoices={invoices}
                records={records}
              />
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
