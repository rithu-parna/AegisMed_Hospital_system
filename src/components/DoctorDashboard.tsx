'use client';

import React, { useState } from 'react';
import { Doctor, Appointment, Patient, MedicalRecord } from '../types/hospital';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Clock, 
  CheckCircle2, 
  Clipboard, 
  Activity, 
  AlertCircle,
  Plus, 
  Trash2,
  FileText,
  UserCheck,
  Heart,
  Thermometer,
  Weight,
  FlameKindling
} from 'lucide-react';

interface DoctorDashboardProps {
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  records: MedicalRecord[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  setRecords: React.Dispatch<React.SetStateAction<MedicalRecord[]>>;
  updateDoctorStatus: (id: string, status: Doctor['status']) => void;
}

export default function DoctorDashboard({
  doctors,
  patients,
  appointments,
  records,
  setAppointments,
  setPatients,
  setRecords,
  updateDoctorStatus
}: DoctorDashboardProps) {
  // Select active doctor context
  const [selectedDocId, setSelectedDocId] = useState<string>(doctors[0]?.id || '');
  const activeDoctor = doctors.find(d => d.id === selectedDocId) || doctors[0];

  // Active appointment being treated
  const [activeApptId, setActiveApptId] = useState<string | null>(null);

  // Clinical notes/prescription state
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  
  // Custom Vitals
  const [bp, setBp] = useState('120/80');
  const [hr, setHr] = useState(72);
  const [temp, setTemp] = useState(98.6);
  const [weight, setWeight] = useState(170);

  // Prescription medicines builders
  const [prescriptions, setPrescriptions] = useState<{
    medicine: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[]>([]);
  
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medFreq, setMedFreq] = useState('');
  const [medDur, setMedDur] = useState('');

  if (!activeDoctor) {
    return <div className="p-8 text-center text-muted-foreground font-semibold">No doctors found in the database.</div>;
  }

  // Filter appointments for active doctor
  const doctorAppointments = appointments.filter(a => a.doctorId === activeDoctor.id);
  const todayStr = new Date().toISOString().split('T')[0];
  
  // Filter today's appointments for active doctor
  const todaysAppointments = doctorAppointments.filter(a => a.date === todayStr || a.status === 'in-progress');
  const activeTreatmentAppointment = appointments.find(a => a.id === activeApptId);
  const activePatient = activeTreatmentAppointment 
    ? patients.find(p => p.id === activeTreatmentAppointment.patientId)
    : null;

  // Preset vitals shortcuts for premium demo experience
  const applyVitalsPreset = (preset: 'normal' | 'fever' | 'hypertension') => {
    if (preset === 'normal') {
      setBp('118/78');
      setHr(68);
      setTemp(98.4);
      setWeight(165);
    } else if (preset === 'fever') {
      setBp('122/82');
      setHr(95);
      setTemp(101.8);
      setWeight(163);
    } else if (preset === 'hypertension') {
      setBp('145/95');
      setHr(84);
      setTemp(98.6);
      setWeight(182);
    }
  };

  const handleAddMedicine = () => {
    if (!medName || !medDosage) return;
    setPrescriptions([...prescriptions, {
      medicine: medName,
      dosage: medDosage,
      frequency: medFreq || 'Once daily',
      duration: medDur || '7 days'
    }]);
    setMedName('');
    setMedDosage('');
    setMedFreq('');
    setMedDur('');
  };

  const handleRemoveMedicine = (idx: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== idx));
  };

  const handleStartConsultation = (apptId: string) => {
    setActiveApptId(apptId);
    setAppointments(prev => prev.map(a => a.id === apptId ? { ...a, status: 'in-progress' } : a));
    
    // Clear / reset diagnosis inputs
    setDiagnosis('');
    setNotes('');
    setPrescriptions([]);
    setBp('120/80');
    setHr(72);
    setTemp(98.6);
    setWeight(170);
  };

  const handleSubmitTreatment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTreatmentAppointment || !activePatient) return;

    // Create medical record
    const newRecord: MedicalRecord = {
      id: `REC-${Date.now().toString().slice(-4)}`,
      patientId: activePatient.id,
      doctorId: activeDoctor.id,
      doctorName: activeDoctor.name,
      date: todayStr,
      diagnosis,
      prescription: prescriptions,
      vitals: {
        bloodPressure: bp,
        heartRate: Number(hr),
        temperature: Number(temp),
        weight: Number(weight)
      },
      notes
    };

    // Update records state
    setRecords(prev => [newRecord, ...prev]);

    // Update patient current treatment and diagnosis histories
    setPatients(prev => prev.map(p => {
      if (p.id === activePatient.id) {
        const currentDiagnoses = p.diagnoses || [];
        return {
          ...p,
          diagnoses: currentDiagnoses.includes(diagnosis) ? currentDiagnoses : [...currentDiagnoses, diagnosis],
          currentTreatment: diagnosis
        };
      }
      return p;
    }));

    // Update appointment status to completed
    setAppointments(prev => prev.map(a => a.id === activeTreatmentAppointment.id ? { ...a, status: 'completed' } : a));

    // Clear active treatment panel
    setActiveApptId(null);
    alert('Treatment saved and patient record updated successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header Panel with Doctor Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 premium-card gap-4">
        <div className="flex items-center gap-4">
          <img
            src={activeDoctor.avatar || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d'}
            alt={activeDoctor.name}
            className="w-14 h-14 rounded-xl object-cover ring-2 ring-primary/20"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black tracking-tight">{activeDoctor.name}</h2>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                activeDoctor.status === 'available' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                activeDoctor.status === 'busy' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                activeDoctor.status === 'on-duty' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                'bg-rose-500/10 text-rose-500 border border-rose-500/20'
              }`}>
                {activeDoctor.status}
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-semibold mt-0.5">{activeDoctor.specialty} • {activeDoctor.department}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Doctor Switcher */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground whitespace-nowrap">Roster:</span>
            <select
              value={selectedDocId}
              onChange={(e) => {
                setSelectedDocId(e.target.value);
                setActiveApptId(null);
              }}
              className="premium-input py-1.5 px-3 font-bold"
            >
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>{doc.name} ({doc.specialty})</option>
              ))}
            </select>
          </div>

          {/* Status Changer */}
          <div className="flex gap-1.5 bg-muted/40 p-1 rounded-xl border border-border/60 text-[9px] font-black tracking-wider uppercase">
            {(['available', 'busy', 'on-duty'] as const).map((status) => (
              <button
                key={status}
                onClick={() => updateDoctorStatus(activeDoctor.id, status)}
                className={`px-2.5 py-1.5 rounded-lg capitalize transition-all ${
                  activeDoctor.status === status
                    ? 'bg-card text-primary shadow-sm border border-border/80'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Workspace split panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Today's Appointment Queue */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 premium-card">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
              <Clock className="h-4.5 w-4.5 text-primary" />
              <span>Today&apos;s Lobby Waiting List</span>
              <span className="ml-auto text-[10px] bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded font-black">
                {todaysAppointments.filter(a => a.status !== 'completed').length} Queue
              </span>
            </h3>

            {todaysAppointments.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground font-semibold">
                <UserCheck className="h-10 w-10 text-muted-foreground/20 mx-auto mb-2" />
                <p>No appointments scheduled for today.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todaysAppointments.map((appt) => {
                  const patient = patients.find(p => p.id === appt.patientId);
                  const isConsulting = appt.id === activeApptId;
                  
                  return (
                    <div
                      key={appt.id}
                      className={`p-4 rounded-xl border transition-all duration-300 relative overflow-hidden ${
                        isConsulting
                          ? 'border-primary bg-primary/5 shadow-glow-teal'
                          : appt.status === 'completed'
                          ? 'border-border/45 opacity-60 bg-slate-50'
                          : 'border-border bg-white hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-extrabold text-sm tracking-tight">{appt.patientName}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-muted-foreground font-bold">Age: {patient?.age || 'N/A'} • {patient?.gender}</span>
                            <span className={`text-[9px] font-black px-1.5 py-0.25 rounded uppercase tracking-wider ${
                              appt.priority === 'high' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                              appt.priority === 'medium' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                              'bg-teal-500/10 text-teal-500 border border-teal-500/20'
                            }`}>
                              {appt.priority}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold font-mono px-2 py-1 rounded bg-muted/60 border border-border/50 text-foreground">
                          {appt.time}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
                        Reason: <strong className="text-foreground/90 font-medium">{appt.reason}</strong>
                      </p>

                      <div className="flex gap-2 mt-3 pt-3 border-t border-border/40 justify-between items-center">
                        <span className={`text-[9px] font-black uppercase tracking-widest ${
                          appt.status === 'completed' ? 'text-emerald-500' :
                          appt.status === 'in-progress' ? 'text-primary animate-pulse' :
                          'text-amber-500'
                        }`}>
                          {appt.status.replace('-', ' ')}
                        </span>

                        {appt.status !== 'completed' && (
                          <button
                            onClick={() => handleStartConsultation(appt.id)}
                            disabled={isConsulting}
                            className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-300 shimmer-btn ${
                              isConsulting 
                                ? 'bg-primary text-primary-foreground shadow-glow-teal'
                                : 'bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground'
                            }`}
                          >
                            {isConsulting ? 'In Consultation' : 'Treat Patient'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Treatment Workspace */}
        <div className="lg:col-span-7 space-y-6">
          {activeTreatmentAppointment && activePatient ? (
            <form onSubmit={handleSubmitTreatment} className="p-6 premium-card shadow-glow-teal space-y-6 animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center border-b border-border/60 pb-4">
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-primary">Active Patient Consultation</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Physician Case File: <strong className="text-foreground">{activePatient.name}</strong> • Record: {activeTreatmentAppointment.id}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveApptId(null)}
                  className="premium-btn premium-btn-secondary px-3 py-1.5 text-[10px]"
                >
                  Close Session
                </button>
              </div>

              {/* Patient Basic Info Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-border/60 text-xs">
                <div>
                  <span className="text-[9px] uppercase font-bold text-muted-foreground block mb-0.5">Blood Type</span>
                  <span className="font-extrabold text-foreground text-sm">{activePatient.bloodGroup}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-rose-400 block mb-0.5">Allergies Warning</span>
                  <span className="font-extrabold text-rose-500 truncate block" title={activePatient.allergies.join(', ') || 'None'}>
                    {activePatient.allergies.join(', ') || 'None'}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-muted-foreground block mb-0.5">Emergency Contact</span>
                  <span className="font-semibold text-foreground truncate block">{activePatient.emergencyContact}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-muted-foreground block mb-0.5">Lobby Complaint</span>
                  <span className="font-bold text-teal-500 truncate block" title={activeTreatmentAppointment.reason}>
                    {activeTreatmentAppointment.reason}
                  </span>
                </div>
              </div>

              {/* Vitals Input Grid & Live Pulse ECG Simulator */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Vitals Capture & Telemetry</h4>
                  
                  {/* Preset Shortcuts */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold text-muted-foreground mr-1 uppercase">Presets:</span>
                    <button
                      type="button"
                      onClick={() => applyVitalsPreset('normal')}
                      className="px-2 py-0.5 rounded bg-white hover:bg-teal-500/10 hover:text-teal-600 border border-border text-[9px] font-bold transition-colors"
                    >
                      Normal
                    </button>
                    <button
                      type="button"
                      onClick={() => applyVitalsPreset('fever')}
                      className="px-2 py-0.5 rounded bg-white hover:bg-rose-500/10 hover:text-rose-600 border border-border text-[9px] font-bold transition-colors"
                    >
                      Fever
                    </button>
                    <button
                      type="button"
                      onClick={() => applyVitalsPreset('hypertension')}
                      className="px-2 py-0.5 rounded bg-white hover:bg-amber-500/10 hover:text-amber-600 border border-border text-[9px] font-bold transition-colors"
                    >
                      High BP
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Inputs */}
                  <div className="md:col-span-8 grid grid-cols-2 gap-3">
                    <div className="relative">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">Blood Pressure</label>
                      <input
                        type="text"
                        value={bp}
                        onChange={(e) => setBp(e.target.value)}
                        placeholder="e.g. 120/80"
                        className="w-full premium-input font-mono font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">Heart Rate (BPM)</label>
                      <input
                        type="number"
                        value={hr}
                        onChange={(e) => setHr(Number(e.target.value))}
                        className="w-full premium-input font-mono font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">Temperature (°F)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={temp}
                        onChange={(e) => setTemp(Number(e.target.value))}
                        className="w-full premium-input font-mono font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">Weight (Lbs)</label>
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(Number(e.target.value))}
                        className="w-full premium-input font-mono font-bold"
                        required
                      />
                    </div>
                  </div>

                  {/* ECG Heartbeat Simulator Widget */}
                  <div className="md:col-span-4 p-3 border border-border/80 rounded-xl bg-muted/20 flex flex-col justify-between items-center text-center overflow-hidden relative">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground block">ECG Line</span>
                    
                    {/* ECG wave */}
                    <div className="w-full h-12 flex items-center justify-center relative">
                      <svg className="w-full h-full text-primary" viewBox="0 0 100 30">
                        <path
                          d="M 0 15 L 25 15 L 30 5 L 35 25 L 40 15 L 45 15 L 50 15 L 55 5 L 60 25 L 65 15 L 100 15"
                          fill="transparent"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="animate-heartbeat"
                        />
                      </svg>
                    </div>

                    <div className="flex items-center gap-1 mt-1 text-primary">
                      <Heart className="h-3 w-3 fill-current animate-pulse text-rose-500" />
                      <span className="text-[10px] font-black font-mono">{hr} BPM</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Diagnosis and Notes */}
              <div className="space-y-4">
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">Primary Diagnosis Assessment *</label>
                  <input
                    type="text"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="e.g. Acute Upper Respiratory Tract Infection, Essential Hypertension"
                    className="w-full premium-input font-extrabold text-foreground"
                    required
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">Clinical Treatment Log & Recommendations</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Write details of diagnosis findings, laboratory test referrals, and general recovery advice..."
                    className="w-full premium-input font-medium"
                  />
                </div>
              </div>

              {/* Prescriptions Form builder */}
              <div className="space-y-3">
                <h4 className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Medications & Prescriptions</h4>
                
                {/* Medicines List table */}
                {prescriptions.length > 0 && (
                  <div className="border border-border/60 rounded-xl overflow-hidden text-xs bg-white/50 backdrop-blur-sm">
                    <table className="premium-table">
                      <thead>
                        <tr>
                          <th>Medicine</th>
                          <th>Dosage</th>
                          <th>Frequency</th>
                          <th>Duration</th>
                          <th className="text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="font-semibold">
                        {prescriptions.map((med, idx) => (
                          <tr key={idx}>
                            <td className="font-bold text-foreground">{med.medicine}</td>
                            <td>{med.dosage}</td>
                            <td className="text-muted-foreground">{med.frequency}</td>
                            <td className="text-muted-foreground">{med.duration}</td>
                            <td className="text-right">
                              <button
                                type="button"
                                onClick={() => handleRemoveMedicine(idx)}
                                className="text-rose-500 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Medication Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-muted/20 p-3 rounded-xl border border-border/40">
                  <div className="sm:col-span-1">
                    <input
                      type="text"
                      value={medName}
                      onChange={(e) => setMedName(e.target.value)}
                      placeholder="Medicine"
                      className="w-full premium-input font-semibold"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={medDosage}
                      onChange={(e) => setMedDosage(e.target.value)}
                      placeholder="e.g. 500mg, 1 tab"
                      className="w-full premium-input"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={medFreq}
                      onChange={(e) => setMedFreq(e.target.value)}
                      placeholder="e.g. Twice daily"
                      className="w-full premium-input"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={medDur}
                      onChange={(e) => setMedDur(e.target.value)}
                      placeholder="e.g. 7 days"
                      className="w-full premium-input"
                    />
                    <button
                      type="button"
                      onClick={handleAddMedicine}
                      className="premium-btn premium-btn-primary p-1.5 rounded-lg border border-primary/20 shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit consult */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full premium-btn premium-btn-primary py-3.5 shadow-glow-teal text-xs shimmer-btn"
                >
                  <CheckCircle2 className="h-4.5 w-4.5" />
                  <span>Submit Diagnosis & Finalize Session</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="h-full min-h-[450px] border border-dashed border-border/85 rounded-2xl flex flex-col items-center justify-center p-8 text-center text-muted-foreground bg-white/40 shadow-sm backdrop-blur-sm select-none">
              <Clipboard className="h-10 w-10 text-muted-foreground/20 mb-3" />
              <h4 className="font-extrabold text-sm text-foreground uppercase tracking-widest">Workspace Available</h4>
              <p className="text-xs max-w-sm mt-2 leading-relaxed">
                Select a patient from the waiting queue on the left by clicking <strong>Treat Patient</strong> to boot the diagnostic panel, read vitals, and issue clinical prescriptions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
