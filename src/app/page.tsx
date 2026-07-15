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
  HeartPulse,
  ShieldCheck,
  Zap,
  Layers,
  ArrowRight,
  TrendingUp,
  Monitor,
  Database,
  Lock,
  Cpu,
  Sun,
  Moon,
  Play,
  Pause,
  Maximize,
  Volume2,
  ChevronLeft,
  FileText
} from 'lucide-react';

export default function HMSHome() {
  const [mounted, setMounted] = useState(false);
  const [showPortal, setShowPortal] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Landing Page Interactive States
  const [activeSlide, setActiveSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [videoProgress, setVideoProgress] = useState(35);
  const [videoTime, setVideoTime] = useState('0:21');

  // Background Slide Index
  const [bgIndex, setBgIndex] = useState(0);

  // Scroll and Back to Top
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Custom Cursor
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [dotPos, setDotPos] = useState({ x: 0, y: 0 });
  const [cursorHidden, setCursorHidden] = useState(true);

  // Count-up Stats
  const [stats, setStats] = useState({ uptime: 0, latency: 0, records: 0, wards: 0 });

  // Core Data States
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([]);

  // Background images
  const bgSlides = [
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&w=1920&q=80"
  ];

  // Hydrate Data on Mount
  useEffect(() => {
    const data = getInitialHMSData();
    setDoctors(data.doctors);
    setPatients(data.patients);
    setAppointments(data.appointments);
    setInvoices(data.invoices);
    setRecords(data.records);

    // Read stored theme preference
    const stored = localStorage.getItem('hms_theme') as 'light' | 'dark';
    if (stored) {
      setTheme(stored);
    } else {
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
  }, [mounted, theme]);

  // Video progress bar automation
  useEffect(() => {
    if (!isVideoPlaying || showPortal) return;
    const interval = setInterval(() => {
      setVideoProgress(p => {
        const next = p + 0.5;
        if (next >= 100) {
          return 0;
        }
        const totalSec = Math.floor((next / 100) * 60);
        setVideoTime(`0:${totalSec < 10 ? '0' + totalSec : totalSec}`);
        return next;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [isVideoPlaying, showPortal]);

  // Auto-play modules slides every 6 seconds
  useEffect(() => {
    if (showPortal) return;
    const interval = setInterval(() => {
      setActiveSlide(s => (s + 1) % 4);
    }, 6000);
    return () => clearInterval(interval);
  }, [showPortal]);

  // Auto-play background image slides every 5 seconds
  useEffect(() => {
    if (showPortal) return;
    const interval = setInterval(() => {
      setBgIndex(idx => (idx + 1) % bgSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [showPortal]);

  // Scroll listeners
  useEffect(() => {
    if (showPortal) return;
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showPortal]);

  // Mouse move trackers
  useEffect(() => {
    if (showPortal) return;
    const handleMouseMove = (e: MouseEvent) => {
      setCursorHidden(false);
      setDotPos({ x: e.clientX, y: e.clientY });
      
      const timeout = setTimeout(() => {
        setCursorPos({ x: e.clientX, y: e.clientY });
      }, 40);
      return () => clearTimeout(timeout);
    };

    const handleMouseLeave = () => {
      setCursorHidden(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [showPortal]);

  // Counter stats animation
  useEffect(() => {
    if (showPortal) return;
    let currentStep = 0;
    const endUptime = 99.98;
    const endLatency = 0.2;
    const endRecords = 500000;
    const endWards = 14;
    const duration = 1500;
    const stepTime = 30;
    const steps = duration / stepTime;

    const interval = setInterval(() => {
      currentStep++;
      setStats({
        uptime: parseFloat(((endUptime / steps) * currentStep).toFixed(2)),
        latency: parseFloat(((endLatency / steps) * currentStep).toFixed(1)),
        records: Math.floor((endRecords / steps) * currentStep),
        wards: Math.min(endWards, Math.floor((endWards / steps) * currentStep))
      });

      if (currentStep >= steps) {
        setStats({ uptime: endUptime, latency: endLatency, records: endRecords, wards: endWards });
        clearInterval(interval);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [showPortal]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const updateDoctorStatus = (docId: string, status: Doctor['status']) => {
    setDoctors(prev => prev.map(doc => doc.id === docId ? { ...doc, status } : doc));
  };

  if (!mounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 text-teal-600 font-semibold gap-3">
        <Activity className="h-6 w-6 animate-pulse" />
        <span className="text-sm uppercase tracking-widest text-slate-500">Initializing AegisMed HMS...</span>
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

  // Slideshow data
  const slideDeck = [
    {
      title: "Physician Treatment workstation",
      tag: "Workspace Suite",
      description: "Interactive clinical terminals showing patient priority waiting queues, vitals telemetry logs, and live ECG monitors.",
      type: "image",
      src: "/dashboard-mockup.png"
    },
    {
      title: "Intelligent Appointment Scheduler",
      tag: "Collision Guard",
      description: "Double-booking checks dynamically warning staff if a doctor is busy at that date and hour.",
      type: "scheduler_preview"
    },
    {
      title: "Itemized Billings & Claims",
      tag: "Financial Engine",
      description: "Calculates balance sheets, custom tax rates, discount lines, and outputs window-ready statements.",
      type: "billing_preview"
    },
    {
      title: "Audit Logs & Ward Telemetry",
      tag: "Hospital Analytics",
      description: "Progress rings showing bed occupancy rates alongside system logs for registry tracing.",
      type: "analytics_preview"
    }
  ];

  // LANDING PAGE VIEW
  if (!showPortal) {
    return (
      <div className="min-h-screen bg-mesh-gradient bg-grid-pattern relative overflow-x-hidden text-foreground selection:bg-teal-500/30 transition-colors duration-300">
        {/* Scroll Progress Bar */}
        <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

        {/* Custom Cursor */}
        {!cursorHidden && (
          <>
            <div 
              className="custom-cursor hidden md:block" 
              style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }} 
            />
            <div 
              className="custom-cursor-dot hidden md:block" 
              style={{ left: `${dotPos.x}px`, top: `${dotPos.y}px` }} 
            />
          </>
        )}

        {/* Mouse Follow Glow */}
        <div 
          className="pointer-events-none fixed h-[350px] w-[350px] rounded-full bg-teal-500/10 blur-[90px] z-10 transition-transform duration-200 ease-out -translate-x-1/2 -translate-y-1/2" 
          style={{ left: `${dotPos.x}px`, top: `${dotPos.y}px` }} 
        />

        {/* Fullscreen Background Slider */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {bgSlides.map((url, idx) => (
            <div
              key={idx}
              className={`bg-slide ${bgIndex === idx ? 'active' : ''}`}
              style={{ backgroundImage: `url(${url})` }}
            />
          ))}
          <div className="bg-slide-overlay" />
        </div>

        {/* Background Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-teal-500/5 dark:bg-teal-500/10 blur-[130px] pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none animate-pulse-glow" />

        {/* Floating Premium Top Header */}
        <header className="sticky top-0 z-50 w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between premium-card border-b border-border/40 rounded-b-2xl shadow-sm bg-white/70 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-glow-teal animate-heartbeat">
              <HeartPulse className="h-5.5 w-5.5 text-white" />
            </div>
            <div>
              <span className="font-black text-lg tracking-wider bg-gradient-to-r from-teal-500 to-emerald-400 bg-clip-text text-transparent uppercase">AegisMed</span>
              <span className="text-[9px] font-extrabold text-muted-foreground block uppercase tracking-widest">Clinical OS</span>
            </div>
          </div>

          {/* Navigation Anchors */}
          <nav className="hidden md:flex items-center gap-8 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Key Features</a>
            <a href="#tour" className="hover:text-foreground transition-colors">Video Tour</a>
            <a href="#carousel" className="hover:text-foreground transition-colors">Workspace Slides</a>
            <a href="#tech" className="hover:text-foreground transition-colors">Tech Specs</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-border bg-card/65 hover:bg-muted/80 text-foreground transition-all duration-300 shadow-sm"
              title="Toggle Theme Mode"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setShowPortal(true)}
              className="premium-btn premium-btn-primary py-2.5 px-5 text-[10px]"
            >
              Launch Console
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left z-10">
            {/* Tag Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-teal-500/20 bg-teal-500/5 text-primary text-[10px] font-black uppercase tracking-widest">
              <Zap className="h-3 w-3 text-teal-400 animate-pulse" />
              <span>Next-Gen Clinic Operations</span>
            </span>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none text-foreground uppercase">
              The Digital Command OS for <span className="bg-gradient-to-r from-teal-500 to-emerald-400 bg-clip-text text-transparent">Clinical networks</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto lg:mx-0 font-semibold leading-relaxed">
              Consolidate patient check-ins, treatment records, custom invoices, scheduling filters, and clinical wards in one sleek, premium light-theme medical workspace.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={() => setShowPortal(true)}
                className="w-full sm:w-auto premium-btn premium-btn-primary py-4 px-8 text-xs"
              >
                <span>Enter Command Console</span>
                <ArrowRight className="h-4.5 w-4.5 stroke-[2.5]" />
              </button>
              <a
                href="#tour"
                className="w-full sm:w-auto premium-btn premium-btn-secondary py-4 px-8 text-xs"
              >
                Watch Console Tour
              </a>
            </div>
          </div>

          {/* Hero Premium Generated Graphic Image */}
          <div className="lg:col-span-6 flex justify-center z-10 animate-float">
            <div 
              onClick={() => setShowPortal(true)}
              className="w-full max-w-lg aspect-[1.1/1] premium-card p-3.5 cursor-pointer hover:scale-[1.02] transition-all duration-500 relative group overflow-hidden"
            >
              <img
                src="/dashboard-mockup.png"
                alt="AegisMed Clinical UI Mockup"
                className="w-full h-full object-cover rounded-xl border border-white/10"
              />
              
              {/* Glass overlay with telemetry label */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-slate-950/80 border border-white/10 text-white flex justify-between items-center backdrop-blur-md select-none">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-teal-400">Clinical telemetry</span>
                  <p className="text-xs font-black tracking-tight uppercase mt-0.5">Eliza Reed • Active Vitals</p>
                </div>
                <div className="flex items-center gap-1 bg-teal-500/10 text-teal-400 px-2.5 py-1 rounded-lg border border-teal-500/20 text-[9px] font-black uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-ping" />
                  <span>Stable</span>
                </div>
              </div>

              {/* Hover overlay launch button */}
              <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                <span className="px-5 py-3 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-[9px] shadow-glow-teal flex items-center gap-1.5">
                  <span>Launch Live Portal</span>
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Animated SVG Wave divider */}
        <div className="w-full overflow-hidden leading-[0] relative z-10 -mt-10 mb-8 pointer-events-none opacity-80">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[45px] text-teal-600/10 dark:text-teal-400/5">
            <path d="M0,0 C150,90 350,90 500,60 C650,30 850,30 1000,60 C1150,90 1200,60 1200,60 L1200,120 L0,120 Z" fill="currentColor"></path>
          </svg>
        </div>

        {/* Feature Grid Section */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-20 relative">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-primary">System Capabilities</span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">Physician Workstation & Client Registers</h2>
            <p className="text-xs text-muted-foreground font-semibold">Modular design optimized for rapid response clinical management.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="p-6 premium-card space-y-4">
              <div className="h-10 w-10 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center">
                <Monitor className="h-5 w-5" />
              </div>
              <h3 className="font-extrabold text-sm uppercase tracking-wide text-foreground">Physician Workspace</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                Clinical consultation terminal featuring live SVG ECG waves, preset vitals telemetry fill-buttons, and custom drug prescription builder pads.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 premium-card space-y-4">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                <Calendar className="h-5 w-5" />
              </div>
              <h3 className="font-extrabold text-sm uppercase tracking-wide text-foreground">Intelligent Scheduler</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                Double-booking collision guard warns clinical assistants before scheduling a patient with a physician who has an active booking at that hour.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 premium-card space-y-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <DollarSign className="h-5 w-5" />
              </div>
              <h3 className="font-extrabold text-sm uppercase tracking-wide text-foreground">Itemized Billings</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                Dynamic invoice builder with live tax/discount math, balance tracking, and optimized printing support to render clean client billing receipts.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 premium-card space-y-4">
              <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="font-extrabold text-sm uppercase tracking-wide text-foreground">Ward Occupancy</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                Real-time bed registers showing overall clinic occupancy, department-wise financial splits, and live administrative audit feed loggers.
              </p>
            </div>
          </div>
        </section>

        {/* Video Tour Simulator Section */}
        <section id="tour" className="max-w-7xl mx-auto px-6 py-20 border-t border-border/40 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-black uppercase tracking-widest text-primary">Interactive Console Tour</span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-tight">Watch AegisMed Telemetry in Motion</h2>
              <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                Observe the active interface telemetry feed simulator. Toggle playback controls to simulate raw clinician logs and vitals streaming updates.
              </p>
              
              <div className="flex gap-4 items-center">
                <button
                  onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                  className="premium-btn premium-btn-primary py-3 px-5 text-[9px]"
                >
                  {isVideoPlaying ? <Pause className="h-3 w-3 fill-current" /> : <Play className="h-3 w-3 fill-current" />}
                  <span>{isVideoPlaying ? 'Pause Telemetry Stream' : 'Start Telemetry Stream'}</span>
                </button>
              </div>
            </div>

            {/* Video Player Wrapper */}
            <div className="lg:col-span-7 flex justify-center">
              <div className="w-full max-w-xl aspect-[16/9] border border-border/80 rounded-2xl bg-slate-950 p-2 relative shadow-2xl overflow-hidden group select-none">
                {/* Visual Telemetry Video Simulation Screen */}
                <div className="w-full h-full rounded-xl bg-slate-900 border border-white/5 relative flex flex-col justify-between p-4 overflow-hidden font-mono text-[9px] text-slate-400">
                  {/* Glowing Scanning line if playing */}
                  {isVideoPlaying && (
                    <div className="absolute inset-x-0 h-[2px] bg-teal-500/20 top-0 animate-[shimmer_3s_infinite_linear] pointer-events-none" />
                  )}

                  {/* Video Top Header */}
                  <div className="flex justify-between items-center z-10">
                    <span className="text-teal-400 font-extrabold uppercase tracking-widest text-[7px] flex items-center gap-1">
                      <span className={`h-1.5 w-1.5 rounded-full ${isVideoPlaying ? 'bg-teal-400 animate-ping' : 'bg-slate-600'}`} />
                      <span>{isVideoPlaying ? 'STREAMING ACTIVE' : 'STREAM STANDBY'}</span>
                    </span>
                    <span className="text-white/60 font-mono text-[8px] bg-slate-950 px-2 py-0.5 rounded border border-white/5">
                      NODE-ID: HMS-SECURE-3003
                    </span>
                  </div>

                  {/* Animating center SVG Vitals graph */}
                  <div className="flex-1 flex flex-col justify-center items-center py-4 z-10">
                    <div className="w-full h-16 flex items-center justify-center">
                      <svg className="w-full h-full text-teal-500 overflow-visible" viewBox="0 0 160 30">
                        <path
                          d="M 0 15 L 40 15 L 45 5 L 50 25 L 55 15 L 60 15 L 85 15 L 90 2 L 95 28 L 100 15 L 105 15 L 160 15"
                          fill="transparent"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={isVideoPlaying ? 'animate-heartbeat' : ''}
                        />
                      </svg>
                    </div>

                    <div className="flex gap-4 mt-2">
                      <div className="flex items-center gap-1 text-[9px] text-white">
                        <Heart className="h-3 w-3 text-rose-500 fill-current animate-pulse" />
                        <span>{isVideoPlaying ? 74 + Math.floor(Math.random() * 4) : 74} BPM</span>
                      </div>
                      <div className="text-[9px] text-teal-400">
                        <span>SPO2: {isVideoPlaying ? 98 + Math.floor(Math.random() * 2) : 98}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Video Ticker Log */}
                  <div className="h-8 overflow-hidden z-10 border-t border-white/5 pt-2 flex items-center justify-between">
                    <span className="text-[8px] opacity-60">LOG: admitted Clark Kent (PAT-104) to Dr. House.</span>
                    <span className="text-[8px] text-teal-500 font-bold font-mono">OK / READY</span>
                  </div>

                  {/* Custom Controls Bar overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-slate-950/90 h-10 border-t border-white/10 px-4 flex items-center justify-between text-white z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                        className="hover:text-primary transition-colors"
                      >
                        {isVideoPlaying ? <Pause className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                      </button>
                      <Volume2 className="h-3.5 w-3.5 text-white/60" />
                    </div>

                    {/* Progress Slider */}
                    <div className="flex-1 mx-4 h-1.5 rounded-full bg-white/20 relative overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-150"
                        style={{ width: `${videoProgress}%` }}
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[8px] font-mono text-white/80">{videoTime} / 1:00</span>
                      <Maximize className="h-3 w-3 text-white/60" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Slideshow Carousel Section */}
        <section id="carousel" className="max-w-7xl mx-auto px-6 py-20 border-t border-border/40 relative">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-primary">Live Workspace Slides</span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">Cycle through Clinical Modules</h2>
            <p className="text-xs text-muted-foreground font-semibold">Browse screenshots and mock layouts representing each interface core tab.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left selector sidebar */}
            <div className="lg:col-span-4 space-y-3.5">
              {slideDeck.map((slide, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-start gap-3.5 ${
                    activeSlide === idx
                      ? 'border-primary bg-primary/5 shadow-sm shadow-primary/5'
                      : 'border-border/60 hover:bg-muted/40 hover:border-border'
                  }`}
                >
                  <span className={`text-[10px] font-black font-mono w-5 h-5 rounded-full border flex items-center justify-center ${
                    activeSlide === idx ? 'border-primary text-primary bg-card shadow-glow-teal' : 'border-border text-muted-foreground'
                  }`}>
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-extrabold text-xs uppercase tracking-wider text-foreground">{slide.title}</h4>
                    <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold mt-0.5 block">{slide.tag}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Right Slideshow Screen Viewport */}
            <div className="lg:col-span-8 flex justify-center">
              <div className="w-full max-w-xl aspect-[1.5/1] premium-card p-4 shadow-xl overflow-hidden relative flex flex-col justify-between animate-in fade-in duration-300">
                <div className="flex-1 flex flex-col justify-center">
                  
                  {/* Render Mock image slide */}
                  {slideDeck[activeSlide].type === 'image' && (
                    <div className="w-full h-full relative flex items-center justify-center overflow-hidden rounded-xl border border-border bg-slate-950">
                      <img
                        src={slideDeck[activeSlide].src}
                        alt={slideDeck[activeSlide].title}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  )}

                  {/* Render simulated scheduler slide */}
                  {slideDeck[activeSlide].type === 'scheduler_preview' && (
                    <div className="w-full h-full border border-border rounded-xl bg-card/60 p-4 space-y-3 font-mono text-[9px] text-slate-400 select-none">
                      <div className="flex justify-between items-center border-b border-border/60 pb-2">
                        <span className="font-bold text-foreground">Appointment Collision checking Engine</span>
                        <span className="text-amber-500 font-extrabold">Warning Alert</span>
                      </div>
                      <div className="p-3 border border-amber-500/20 bg-amber-500/5 rounded-lg space-y-1.5">
                        <div className="flex items-center gap-1.5 text-amber-500 font-extrabold uppercase text-[8px] tracking-wider">
                          <Activity className="h-3 w-3" />
                          <span>Doctor Double-Booking Warning!</span>
                        </div>
                        <p className="text-[8px] text-muted-foreground leading-relaxed">
                          Dr. Gregory House has an existing completed consultation at 15:00. Please select a different hour or physician to save.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="p-2 border border-border rounded-lg"><span className="text-[7px] block">Physician</span><strong className="text-foreground">Dr. Gregory House</strong></div>
                        <div className="p-2 border border-border rounded-lg"><span className="text-[7px] block">Slot Time</span><strong className="text-foreground">15:00</strong></div>
                      </div>
                    </div>
                  )}

                  {/* Render simulated billing slide */}
                  {slideDeck[activeSlide].type === 'billing_preview' && (
                    <div className="w-full h-full border border-border rounded-xl bg-card/60 p-4 space-y-3 font-mono text-[9px] text-slate-400 select-none">
                      <div className="flex justify-between items-center border-b border-border/60 pb-2">
                        <span className="font-bold text-foreground">Itemized Invoice Invoice Statement</span>
                        <span className="text-teal-400 font-extrabold">INV-1090</span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-foreground font-bold"><span>Line item description</span><span>Amount</span></div>
                        <hr className="border-border/60" />
                        <div className="flex justify-between"><span>Echocardiogram cardiac analysis</span><span>$450.00</span></div>
                        <div className="flex justify-between"><span>Initial diagnosis specialist consult</span><span>$150.00</span></div>
                        <div className="flex justify-between"><span>Hospital bed stay room rate</span><span>$1,200.00</span></div>
                      </div>
                      <div className="pt-2 border-t border-border/80 space-y-1 text-right">
                        <div><span>Subtotal:</span> <strong className="text-foreground">$1,800.00</strong></div>
                        <div><span>Tax (10%):</span> <strong className="text-foreground">$180.00</strong></div>
                        <div><span>Total Invoice:</span> <strong className="text-teal-400 font-extrabold">$1,980.00</strong></div>
                      </div>
                    </div>
                  )}

                  {/* Render simulated analytics slide */}
                  {slideDeck[activeSlide].type === 'analytics_preview' && (
                    <div className="w-full h-full border border-border rounded-xl bg-card/60 p-4 space-y-3 font-mono text-[9px] text-slate-400 select-none flex flex-col justify-between">
                      <div className="flex justify-between items-center border-b border-border/60 pb-2">
                        <span className="font-bold text-foreground">Clinic Ward Occupancy Telemetry</span>
                        <span className="text-primary font-bold">Active logs</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 items-center">
                        <div className="flex justify-center">
                          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                            <path className="text-white/10" stroke="currentColor" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path className="text-teal-500" strokeDasharray="65, 100" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          </svg>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[8px] opacity-60">WARD STATUS:</span>
                          <p className="text-xs text-foreground font-black">65% Wards Occupied</p>
                          <p className="text-[8px] text-teal-400 font-bold">13 Beds Occupied / 20 Total</p>
                        </div>
                      </div>
                      <div className="text-[8px] border-t border-border/60 pt-2 opacity-60">
                        AUDIT: admin registered Clark Kent • updated House availability status.
                      </div>
                    </div>
                  )}

                </div>

                {/* Foot detail description */}
                <div className="mt-4 pt-3 border-t border-border/60 flex justify-between items-center text-xs">
                  <p className="text-muted-foreground font-semibold leading-relaxed max-w-[90%]">
                    {slideDeck[activeSlide].description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Infinite Logo Marquee */}
        <section className="border-y border-border/40 py-10 bg-slate-50/50 backdrop-blur-md overflow-hidden relative select-none z-10">
          <div className="text-center mb-5">
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Trusted by Leading Medical Networks</span>
          </div>
          <div className="relative w-full overflow-hidden flex">
            <div className="animate-marquee flex gap-16 whitespace-nowrap items-center text-slate-400 font-black tracking-widest text-[10px] uppercase">
              <span>Siemens Healthineers</span>
              <span>Philips Healthcare</span>
              <span>GE HealthCare</span>
              <span>Medtronic Digital</span>
              <span>Cerner Systems</span>
              <span>Epic Medical</span>
              <span>Mayo Clinic Labs</span>
              <span>Cleveland Digital</span>
              {/* Second set for infinite marquee loop */}
              <span>Siemens Healthineers</span>
              <span>Philips Healthcare</span>
              <span>GE HealthCare</span>
              <span>Medtronic Digital</span>
              <span>Cerner Systems</span>
              <span>Epic Medical</span>
              <span>Mayo Clinic Labs</span>
              <span>Cleveland Digital</span>
            </div>
          </div>
        </section>

        {/* Live Counters Banner */}
        <section className="bg-slate-50 border-y border-border py-10 select-none text-slate-500 text-[10px] font-black uppercase tracking-widest relative z-10">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <span className="text-xl text-slate-900 font-mono font-black block">
                {stats.uptime.toFixed(2)}%
              </span>
              <span>SYSTEM UPTIME RATING</span>
            </div>
            <div className="space-y-1">
              <span className="text-xl text-teal-600 font-mono font-black block">
                {stats.latency.toFixed(1)}ms
              </span>
              <span>COLLISION CHECK LATENCY</span>
            </div>
            <div className="space-y-1">
              <span className="text-xl text-slate-900 font-mono font-black block">
                {stats.records.toLocaleString()}+
              </span>
              <span>PATIENT RECORDS ARCHIVED</span>
            </div>
            <div className="space-y-1">
              <span className="text-xl text-indigo-600 font-mono font-black block">
                {stats.wards}+
              </span>
              <span>CLINICAL WARDS ACTIVE</span>
            </div>
          </div>
        </section>

        {/* Technical specs section */}
        <section id="tech" className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-black uppercase tracking-widest text-primary">Architecture Details</span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">Next.js 14 Technical stack</h2>
              <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                Built to be lightweight and responsive. Leverages TypeScript models for all database entities and coordinates local state mapping seamlessly.
              </p>
              
              <ul className="space-y-3.5 text-xs font-bold text-foreground">
                <li className="flex items-center gap-2.5"><Cpu className="h-4.5 w-4.5 text-teal-400" /><span>App Router State Synchronization</span></li>
                <li className="flex items-center gap-2.5"><Database className="h-4.5 w-4.5 text-teal-400" /><span>Hydrated localStorage Persistence</span></li>
                <li className="flex items-center gap-2.5"><Lock className="h-4.5 w-4.5 text-teal-400" /><span>Type-Strict Data Interfaces</span></li>
              </ul>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 premium-card space-y-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-primary">Framework</span>
                <h4 className="font-extrabold text-sm text-foreground">Next.js 14.2.15</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-semibold">Runs on standard Node 18, optimizing server-side pre-rendering and fast hydration cycles.</p>
              </div>
              <div className="p-6 premium-card space-y-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-primary">Utility Layer</span>
                <h4 className="font-extrabold text-sm text-foreground">Tailwind CSS 3.4</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-semibold">Decoupled from native Rust compilers to maintain absolute stability across varying container nodes.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="max-w-7xl mx-auto px-6 py-10 border-t border-border/40 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest space-y-3 relative z-10">
          <p>© 2026 AegisMed Clinical Systems. All rights reserved.</p>
          <p className="text-[9px] text-teal-500 font-extrabold">Advanced Physician Workspace Portal</p>
        </footer>

        {/* Back to Top Button */}
        {showBackToTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-50 p-3 rounded-xl bg-primary text-primary-foreground shadow-glow-teal hover:scale-110 active:scale-95 transition-all duration-300 shimmer-btn border border-teal-500/20"
            title="Back to Top"
          >
            <ChevronLeft className="h-5 w-5 rotate-90" />
          </button>
        )}
      </div>
    );
  }

  // DASHBOARD PORTAL VIEW
  return (
    <div className="flex h-screen overflow-hidden bg-mesh-gradient bg-grid-pattern relative">
      {/* Background glowing gradients for premium aesthetics */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-teal-500/5 blur-[130px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[130px] pointer-events-none animate-pulse-glow" />

      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        onLogout={() => setShowPortal(false)}
      />

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header Dashboard Area */}
        <header className="h-16 px-8 border-b border-border/60 flex items-center justify-between bg-card/20 backdrop-blur-md z-10 no-print">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-muted-foreground">HMS Command Console</span>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
            <span className="text-[10px] uppercase tracking-widest font-black text-primary">
              {activeTab === 'dashboard' ? 'Overview' : activeTab.replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-6">
            {/* Live Date-Time Ticker */}
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Live Server Connected</span>
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
              <div className="flex justify-between items-center p-6 border border-primary/20 rounded-2xl bg-gradient-to-r from-teal-500/10 via-primary/5 to-transparent backdrop-blur-md shadow-glow-teal relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none blur-xl" />
                <div>
                  <h2 className="text-lg font-black tracking-tight uppercase">Medical Center Control Panel</h2>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">Real-time clinical roster statistics, client intake queues, and general invoice audits.</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shadow-lg animate-heartbeat shrink-0">
                  <Activity className="h-5 w-5" />
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
                <div className="xl:col-span-7 p-6 premium-card">
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                    <Stethoscope className="h-4.5 w-4.5 text-primary" />
                    <span>Clinic Ward Roster & Physician Status</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {doctors.map((doc) => (
                      <div key={doc.id} className="p-4 premium-card flex items-center gap-3">
                        <img 
                          src={doc.avatar} 
                          alt={doc.name} 
                          className="h-10 w-10 rounded-lg object-cover ring-2 ring-primary/10"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-extrabold text-xs tracking-tight truncate">{doc.name}</h4>
                          <p className="text-[10px] text-muted-foreground font-semibold truncate">{doc.specialty}</p>
                          <span className={`inline-block text-[8px] font-black px-1.5 py-0.25 rounded uppercase tracking-wider mt-1 border ${
                            doc.status === 'available' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                            doc.status === 'busy' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                            doc.status === 'on-duty' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                            'bg-rose-500/10 text-rose-500 border-rose-500/20'
                          }`}>
                            {doc.status.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Queue Summary panel */}
                <div className="xl:col-span-5 p-6 premium-card flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                      <Clock className="h-4.5 w-4.5 text-primary" />
                      <span>Live lobby intakes</span>
                    </h3>
                    
                    <div className="space-y-3">
                      {appointments
                        .filter(a => a.status === 'scheduled' || a.status === 'in-progress')
                        .slice(0, 3)
                        .map((appt) => (
                          <div key={appt.id} className="flex justify-between items-center p-3 rounded-xl bg-muted/20 border border-border/40 text-xs">
                            <div>
                              <p className="font-bold text-foreground">{appt.patientName}</p>
                              <p className="text-[9px] text-muted-foreground font-semibold">Staff: {appt.doctorName}</p>
                            </div>
                            <span className="font-mono font-bold bg-card border border-border/60 px-2 py-0.5 rounded text-[9px] text-primary">
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
                    className="w-full mt-4 py-2.5 bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground font-black uppercase tracking-wider rounded-xl text-[10px] flex items-center justify-center gap-1.5 transition-all duration-300 shimmer-btn"
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
