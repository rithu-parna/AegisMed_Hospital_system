'use client';

import React, { useState } from 'react';
import { Doctor, Patient, Appointment, Invoice, MedicalRecord } from '../types/hospital';
import AnalyticsChart from './AnalyticsChart';
import { 
  BarChart3, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Activity, 
  ShieldAlert, 
  Layers,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

interface ReportManagerProps {
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  invoices: Invoice[];
  records: MedicalRecord[];
}

export default function ReportManager({
  doctors,
  patients,
  appointments,
  invoices,
  records
}: ReportManagerProps) {
  const [exporting, setExporting] = useState<string | null>(null);

  // Generate department analytics
  const departments = [
    { name: 'Cardiology', activeStaff: 2, totalBedCount: 30, occupiedBedCount: 22, color: 'border-teal-500/20' },
    { name: 'Pediatrics', activeStaff: 1, totalBedCount: 25, occupiedBedCount: 15, color: 'border-emerald-500/20' },
    { name: 'Internal Medicine', activeStaff: 1, totalBedCount: 40, occupiedBedCount: 32, color: 'border-blue-500/20' },
    { name: 'Infectious Diseases', activeStaff: 1, totalBedCount: 35, occupiedBedCount: 28, color: 'border-amber-500/20' },
    { name: 'Maternity Ward', activeStaff: 1, totalBedCount: 20, occupiedBedCount: 12, color: 'border-indigo-500/20' }
  ];

  const totalBeds = departments.reduce((acc, d) => acc + d.totalBedCount, 0);
  const totalOccupied = departments.reduce((acc, d) => acc + d.occupiedBedCount, 0);
  const occupancyPercent = ((totalOccupied / totalBeds) * 100).toFixed(1);

  // Calculate monthly patient visits mock trends based on appointment dates
  const visitsData = [
    { label: 'Jan', value1: 45, value2: 30 },
    { label: 'Feb', value1: 60, value2: 38 },
    { label: 'Mar', value1: 75, value2: 45 },
    { label: 'Apr', value1: 90, value2: 52 },
    { label: 'May', value1: 110, value2: 70 },
    { label: 'Jun', value1: 135, value2: 95 },
    { label: 'Jul', value1: 150, value2: 112 }
  ];

  // Financial department share mock calculations
  const financialData = [
    { label: 'Cardiology', value1: 18500 },
    { label: 'Pediatrics', value1: 9500 },
    { label: 'Internal Med', value1: 14200 },
    { label: 'Infectious Dis', value1: 12800 },
    { label: 'Maternity', value1: 8200 },
    { label: 'Surgery', value1: 22000 }
  ];

  // Simulate file exports
  const handleExport = (type: string, filename: string) => {
    setExporting(type);
    setTimeout(() => {
      setExporting(null);
      alert(`HMS System: ${filename} exported and saved to Downloads folder successfully.`);
    }, 1500);
  };

  // Dynamically compile an audit log feed
  const generateAuditLogs = () => {
    const logs: {
      id: string;
      time: string;
      category: string;
      event: string;
      severity: 'info' | 'warning' | 'success';
    }[] = [];
    
    // Add logs for patients
    patients.forEach((p, idx) => {
      logs.push({
        id: `LOG-P${idx}`,
        time: 'Today, ' + p.registrationDate.split('-')[2] + ' ' + new Date(p.registrationDate).toLocaleString('default', { month: 'short' }),
        category: 'Patient Management',
        event: `Registered patient profile '${p.name}' (ID: ${p.id})`,
        severity: 'info'
      });
    });

    // Add logs for appointments
    appointments.forEach((a, idx) => {
      logs.push({
        id: `LOG-A${idx}`,
        time: 'Today, ' + a.date.split('-')[2] + ' ' + new Date(a.date).toLocaleString('default', { month: 'short' }),
        category: 'Appointments',
        event: `Scheduled appointment ${a.id} for '${a.patientName}' with ${a.doctorName}`,
        severity: a.priority === 'high' ? 'warning' : 'info'
      });
    });

    // Add logs for invoices
    invoices.forEach((inv, idx) => {
      logs.push({
        id: `LOG-I${idx}`,
        time: 'Today, ' + inv.invoiceDate.split('-')[2] + ' ' + new Date(inv.invoiceDate).toLocaleString('default', { month: 'short' }),
        category: 'Billing',
        event: `Generated invoice ${inv.id} for ${inv.patientName} amounting $${inv.totalAmount.toFixed(2)} (${inv.status})`,
        severity: inv.status === 'unpaid' ? 'warning' : 'success'
      });
    });

    // Add medical records logs
    records.forEach((rec, idx) => {
      logs.push({
        id: `LOG-R${idx}`,
        time: 'Today, ' + rec.date.split('-')[2] + ' ' + new Date(rec.date).toLocaleString('default', { month: 'short' }),
        category: 'Clinical',
        event: `Uploaded diagnostic record for ${rec.patientId}: Diagnosis: '${rec.diagnosis}'`,
        severity: 'success'
      });
    });

    // Sort by id descending
    return logs.slice(0, 10);
  };

  const logs = generateAuditLogs();

  return (
    <div className="space-y-6">
      
      {/* Export Controls Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border border-border rounded-2xl bg-card/40 backdrop-blur-md gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span>Reports & Analytical Workspace</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Export operational and financial datasets to local storage files.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => handleExport('PDF', 'HMS_Operational_Overview.pdf')}
            disabled={exporting !== null}
            className="flex-1 sm:flex-initial px-3.5 py-2 border border-border rounded-xl text-xs font-bold hover:bg-muted transition-colors flex items-center justify-center gap-2"
          >
            <FileText className="h-4 w-4 text-rose-500" />
            <span>{exporting === 'PDF' ? 'Generating PDF...' : 'Export PDF Summary'}</span>
          </button>
          <button
            onClick={() => handleExport('CSV', 'HMS_Billing_Report.csv')}
            disabled={exporting !== null}
            className="flex-1 sm:flex-initial px-3.5 py-2 bg-primary text-primary-foreground font-bold hover:opacity-90 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-300" />
            <span>{exporting === 'CSV' ? 'Exporting CSV...' : 'Download Financial CSV'}</span>
          </button>
        </div>
      </div>

      {/* Main Charts & Analytics Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Visual Charts: Left 8 cols */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnalyticsChart
              type="line"
              data={visitsData}
              title="Patient Visits Trend (Jan - Jul 2026)"
              value1Label="Total Visits"
              value2Label="Completed Treatments"
              color="teal"
            />
            <AnalyticsChart
              type="bar"
              data={financialData}
              title="Gross Billing Revenue by Speciality ($)"
              value1Label="Revenue ($)"
              color="indigo"
            />
          </div>

          {/* Audit Logs Feed */}
          <div className="p-6 border border-border rounded-2xl bg-card/30 backdrop-blur-md">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <span>Live System Audit Log</span>
            </h3>

            <div className="border border-border/80 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted text-muted-foreground font-semibold border-b border-border/80">
                    <th className="p-3">Time</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Event Detail</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/20">
                      <td className="p-3 font-mono text-muted-foreground">{log.time}</td>
                      <td className="p-3 font-bold text-foreground">{log.category}</td>
                      <td className="p-3 text-muted-foreground">{log.event}</td>
                      <td className="p-3 text-right">
                        <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          log.severity === 'warning' ? 'bg-amber-500/10 text-amber-500' :
                          log.severity === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                          'bg-primary/10 text-primary'
                        }`}>
                          {log.severity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Operational Statistics: Right 4 cols */}
        <div className="lg:col-span-4 space-y-6">
          {/* Bed Occupancy Card */}
          <div className="p-6 border border-border rounded-2xl bg-card/30 backdrop-blur-md flex flex-col items-center justify-center text-center">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Bed Occupancy Rating</h3>
            
            {/* SVG Circle Progress */}
            <div className="relative h-32 w-32 mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted/30"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-primary transition-all duration-500"
                  strokeDasharray="326.7"
                  strokeDashoffset={326.7 - (326.7 * Number(occupancyPercent)) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold font-mono">{occupancyPercent}%</span>
                <span className="text-[9px] font-bold uppercase text-muted-foreground">Occupied</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground font-semibold leading-relaxed max-w-[220px]">
              Currently housing <strong>{totalOccupied}</strong> patients out of <strong>{totalBeds}</strong> certified beds.
            </p>
          </div>

          {/* Department Breakdown details list */}
          <div className="p-6 border border-border rounded-2xl bg-card/30 backdrop-blur-md">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Ward Breakdown</h3>
            <div className="space-y-4">
              {departments.map((dept, i) => {
                const deptOccPercent = ((dept.occupiedBedCount / dept.totalBedCount) * 100).toFixed(0);
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold">{dept.name}</span>
                      <span className="font-semibold font-mono text-muted-foreground">
                        {dept.occupiedBedCount}/{dept.totalBedCount} ({deptOccPercent}%)
                      </span>
                    </div>
                    {/* Linear Progress bar */}
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${deptOccPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
