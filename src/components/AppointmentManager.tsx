'use client';

import React, { useState } from 'react';
import { Appointment, Doctor, Patient } from '../types/hospital';
import { 
  Calendar, 
  Clock, 
  Search, 
  X, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  ArrowRight,
  UserCheck
} from 'lucide-react';

interface AppointmentManagerProps {
  appointments: Appointment[];
  doctors: Doctor[];
  patients: Patient[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
}

export default function AppointmentManager({
  appointments,
  doctors,
  patients,
  setAppointments
}: AppointmentManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  // New Appointment Form fields
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [notes, setNotes] = useState('');

  const hasConflict = () => {
    if (!doctorId || !date || !time) return false;
    return appointments.some(appt => 
      appt.doctorId === doctorId && 
      appt.date === date && 
      appt.time === time &&
      appt.status !== 'cancelled' &&
      appt.status !== 'completed'
    );
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !doctorId || !date || !time || !reason) return;

    const patient = patients.find(p => p.id === patientId);
    const doctor = doctors.find(d => d.id === doctorId);

    if (!patient || !doctor) return;

    const newAppt: Appointment = {
      id: `APP-${Date.now().toString().slice(-4)}`,
      patientId: patient.id,
      patientName: patient.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      date,
      time,
      reason,
      status: 'scheduled',
      priority,
      notes: notes || undefined
    };

    setAppointments(prev => [newAppt, ...prev]);
    setPatientId('');
    setDoctorId('');
    setDate('');
    setTime('');
    setReason('');
    setPriority('medium');
    setNotes('');
    setIsBookModalOpen(false);
  };

  const handleUpdateStatus = (apptId: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(a => a.id === apptId ? { ...a, status } : a));
  };

  const handleDeleteAppointment = (apptId: string) => {
    if (confirm('Are you sure you want to remove this appointment?')) {
      setAppointments(prev => prev.filter(a => a.id !== apptId));
    }
  };

  const filteredAppointments = appointments.filter(a => {
    const matchesSearch = a.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || a.status === selectedStatus;
    const matchesPriority = selectedPriority === 'All' || a.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Query Filter and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 premium-card">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by Patient, Doctor or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 premium-input"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="premium-input py-2 px-3 text-muted-foreground font-bold"
          >
            <option value="All">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="premium-input py-2 px-3 text-muted-foreground font-bold"
          >
            <option value="All">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <button
          onClick={() => setIsBookModalOpen(true)}
          className="w-full md:w-auto premium-btn premium-btn-primary py-2.5 px-4 text-xs"
        >
          <Calendar className="h-4 w-4" />
          <span>Book Appointment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAppointments.length === 0 ? (
          <div className="col-span-full py-16 text-center text-muted-foreground border border-dashed border-border rounded-2xl bg-card/10">
            <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <h4 className="font-bold text-sm text-foreground">No Appointments Scheduled</h4>
            <p className="text-xs mt-1">There are no appointments matching your filters.</p>
          </div>
        ) : (
          filteredAppointments.map((appt) => (
            <div 
              key={appt.id} 
              className={`p-6 premium-card flex flex-col justify-between ${
                appt.status === 'cancelled' ? 'opacity-65' : ''
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] text-muted-foreground font-mono font-bold bg-muted px-2 py-0.5 rounded">
                    {appt.id}
                  </span>
                  
                  {/* Status Indicator */}
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    appt.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                    appt.status === 'in-progress' ? 'bg-primary/10 text-primary animate-pulse' :
                    appt.status === 'cancelled' ? 'bg-rose-500/10 text-rose-500' :
                    'bg-amber-500/10 text-amber-500'
                  }`}>
                    {appt.status}
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Patient Info */}
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold text-sm">
                      {appt.patientName[0]}
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block font-semibold leading-none mb-1">Patient</span>
                      <h4 className="font-bold text-sm leading-tight text-foreground">{appt.patientName}</h4>
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold text-sm">
                      <UserCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block font-semibold leading-none mb-1">Assigned Physician</span>
                      <h4 className="font-bold text-sm leading-tight text-foreground">{appt.doctorName}</h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-muted/40 border border-border/20 text-xs font-semibold mt-4">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      <span>{appt.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      <span>{appt.time}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 mt-3 text-xs">
                    <p className="text-muted-foreground leading-relaxed">
                      <span className="font-bold text-foreground">Reason:</span> {appt.reason}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">Priority:</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.25 rounded-md ${
                        appt.priority === 'high' ? 'bg-rose-500/10 text-rose-500' :
                        appt.priority === 'medium' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-teal-500/10 text-teal-500'
                      }`}>
                        {appt.priority}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Update Actions */}
              {appt.status !== 'completed' && appt.status !== 'cancelled' && (
                <div className="flex gap-2 border-t border-border/50 pt-4 mt-5 text-xs font-semibold justify-end">
                  <button
                    onClick={() => handleUpdateStatus(appt.id, 'cancelled')}
                    className="premium-btn premium-btn-secondary text-rose-500 hover:text-rose-600 px-3 py-1.5 text-[10px]"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(appt.id, 'completed')}
                    className="premium-btn premium-btn-primary px-3 py-1.5 text-[10px]"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Complete</span>
                  </button>
                </div>
              )}
              {(appt.status === 'completed' || appt.status === 'cancelled') && (
                <div className="flex justify-end pt-4 mt-5 border-t border-border/50">
                  <button
                    onClick={() => handleDeleteAppointment(appt.id)}
                    className="text-xs font-bold text-muted-foreground hover:text-rose-500 transition-colors"
                  >
                    Remove Log
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Book Appointment Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md premium-card p-6 relative animate-in zoom-in-95 duration-200">
            {/* Modal Close */}
            <button 
              onClick={() => setIsBookModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/80"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Schedule New Appointment</span>
            </h3>

            <form onSubmit={handleBookAppointment} className="space-y-4">
              {/* Select Patient */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Select Patient *</label>
                <select
                  required
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full premium-input font-bold text-muted-foreground"
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                  ))}
                </select>
              </div>

              {/* Select Doctor */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Assigned Physician *</label>
                <select
                  required
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  className="w-full premium-input font-bold text-muted-foreground"
                >
                  <option value="">-- Choose Physician --</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.name} - {d.specialty} ({d.status})</option>
                  ))}
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Appointment Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full premium-input font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Appointment Time *</label>
                  <select
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full premium-input font-bold text-muted-foreground"
                  >
                    <option value="">-- Time --</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="09:30">09:30 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="10:30">10:30 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="11:30">11:30 AM</option>
                    <option value="13:00">01:00 PM</option>
                    <option value="13:30">01:30 PM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="14:30">02:30 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="15:30">03:30 PM</option>
                    <option value="16:00">04:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Conflict Warning banner */}
              {hasConflict() && (
                <div className="flex gap-2 p-3 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-500 rounded-xl text-xs animate-pulse">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <p className="font-semibold">
                    Conflict Warning: The selected doctor already has another booking at this date/time. Double-booking is permitted, but may require scheduling adjustments.
                  </p>
                </div>
              )}

              {/* Priority */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Consultation Urgency *</label>
                <div className="flex gap-4">
                  {(['low', 'medium', 'high'] as const).map((prio) => (
                    <label key={prio} className="flex items-center gap-1.5 text-xs font-semibold capitalize cursor-pointer">
                      <input
                        type="radio"
                        name="priority"
                        value={prio}
                        checked={priority === prio}
                        onChange={() => setPriority(prio)}
                        className="text-primary focus:ring-primary"
                      />
                      <span>{prio}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Reason for Visit */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Reason for Visit *</label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Routine blood analysis, chronic insomnia follow-up"
                  className="w-full premium-input"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Physician Notes / Directives</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional medical context or preparation warnings..."
                  className="w-full premium-input"
                />
              </div>

              {/* Form submit footer */}
              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="premium-btn premium-btn-secondary px-4 py-2 text-xs"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="premium-btn premium-btn-primary px-5 py-2 text-xs"
                >
                  <span>Book Schedule</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
