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
  UserCheck
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border border-border rounded-2xl bg-card/40 backdrop-blur-md gap-4">
        <div className="flex items-center gap-4">
          <img
            src={activeDoctor.avatar || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d'}
            alt={activeDoctor.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary/20"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{activeDoctor.name}</h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                activeDoctor.status === 'available' ? 'bg-emerald-500/10 text-emerald-500' :
                activeDoctor.status === 'busy' ? 'bg-amber-500/10 text-amber-500' :
                activeDoctor.status === 'on-duty' ? 'bg-blue-500/10 text-blue-500' :
                'bg-rose-500/10 text-rose-500'
              }`}>
                {activeDoctor.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{activeDoctor.specialty} • {activeDoctor.department}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Doctor Switcher */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Active Workspace:</span>
            <select
              value={selectedDocId}
              onChange={(e) => {
                setSelectedDocId(e.target.value);
                setActiveApptId(null);
              }}
              className="px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>{doc.name} ({doc.specialty})</option>
              ))}
            </select>
          </div>

          {/* Status Changer */}
          <div className="flex gap-1.5 bg-muted p-1 rounded-xl border border-border/50 text-[10px] font-bold">
            {(['available', 'busy', 'on-leave'] as const).map((status) => (
              <button
                key={status}
                onClick={() => updateDoctorStatus(activeDoctor.id, status)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                  activeDoctor.status === status
                    ? 'bg-card text-foreground shadow-sm'
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
          <div className="p-6 border border-border rounded-2xl bg-card/30 backdrop-blur-md">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>Today&apos;s Patient Queue</span>
              <span className="ml-auto text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-bold">
                {todaysAppointments.filter(a => a.status !== 'completed').length} Pending
              </span>
            </h3>

            {todaysAppointments.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                <UserCheck className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
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
                      className={`p-4 rounded-xl border transition-all duration-200 ${
                        isConsulting
                          ? 'border-primary bg-primary/5 shadow-md'
                          : appt.status === 'completed'
                          ? 'border-border/40 opacity-70 bg-muted/20'
                          : 'border-border bg-card/60 hover:bg-card'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-sm">{appt.patientName}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-muted-foreground font-medium">Age: {patient?.age || 'N/A'} • {patient?.gender}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.25 rounded-md uppercase tracking-wider ${
                              appt.priority === 'high' ? 'bg-rose-500/10 text-rose-500' :
                              appt.priority === 'medium' ? 'bg-amber-500/10 text-amber-500' :
                              'bg-teal-500/10 text-teal-500'
                            }`}>
                              {appt.priority} Priority
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-bold font-mono px-2 py-1 rounded bg-muted">
                          {appt.time}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
                        Reason: {appt.reason}
                      </p>

                      <div className="flex gap-2 mt-3 pt-3 border-t border-border/50 justify-between items-center">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${
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
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                              isConsulting 
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground'
                            }`}
                          >
                            {isConsulting ? 'Consulting...' : 'Treat Patient'}
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
            <form onSubmit={handleSubmitTreatment} className="p-6 border border-primary/20 rounded-2xl bg-card/40 backdrop-blur-md shadow-lg space-y-6">
              <div className="flex justify-between items-center border-b border-border pb-4">
                <div>
                  <h3 className="text-base font-bold text-primary">Clinical Consultation</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Treating patient <strong>{activePatient.name}</strong> • Record ID: {activeTreatmentAppointment.id}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveApptId(null)}
                  className="text-xs font-semibold px-3 py-1.5 border border-border rounded-xl hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
              </div>

              {/* Patient Basic Info Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/50 border border-border/60 text-xs">
                <div>
                  <span className="text-muted-foreground block font-semibold mb-0.5">Blood Group</span>
                  <span className="font-bold text-foreground text-sm">{activePatient.bloodGroup}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-semibold mb-0.5">Allergies</span>
                  <span className="font-bold text-rose-500 truncate block" title={activePatient.allergies.join(', ') || 'None'}>
                    {activePatient.allergies.join(', ') || 'None'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-semibold mb-0.5">Emergency Contact</span>
                  <span className="font-semibold text-foreground truncate block">{activePatient.emergencyContact.split(' ')[0]}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-semibold mb-0.5">Reason for Visit</span>
                  <span className="font-semibold text-foreground truncate block" title={activeTreatmentAppointment.reason}>
                    {activeTreatmentAppointment.reason}
                  </span>
                </div>
              </div>

              {/* Vitals Input Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Vitals Capture</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Blood Pressure</label>
                    <input
                      type="text"
                      value={bp}
                      onChange={(e) => setBp(e.target.value)}
                      placeholder="e.g. 120/80"
                      className="w-full px-3 py-2 border border-border rounded-xl bg-card focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Heart Rate (bpm)</label>
                    <input
                      type="number"
                      value={hr}
                      onChange={(e) => setHr(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-border rounded-xl bg-card focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Temp (°F)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={temp}
                      onChange={(e) => setTemp(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-border rounded-xl bg-card focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Weight (lbs)</label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-border rounded-xl bg-card focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Diagnosis and Notes */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">Primary Diagnosis</label>
                  <input
                    type="text"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="e.g. Acute Bronchitis, Essential Hypertension"
                    className="w-full px-3 py-2 border border-border rounded-xl bg-card focus:outline-none focus:ring-1 focus:ring-primary text-xs font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">Clinical Treatment Notes</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe clinical findings, severity, and advice..."
                    className="w-full px-3 py-2 border border-border rounded-xl bg-card focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                  />
                </div>
              </div>

              {/* Prescriptions Form builder */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Medications & Prescriptions</h4>
                
                {/* Medicines List table */}
                {prescriptions.length > 0 && (
                  <div className="border border-border/80 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-muted text-muted-foreground font-semibold">
                          <th className="p-2">Medicine</th>
                          <th className="p-2">Dosage</th>
                          <th className="p-2">Frequency</th>
                          <th className="p-2">Duration</th>
                          <th className="p-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {prescriptions.map((med, idx) => (
                          <tr key={idx} className="hover:bg-muted/30">
                            <td className="p-2 font-bold">{med.medicine}</td>
                            <td className="p-2 font-medium">{med.dosage}</td>
                            <td className="p-2 text-muted-foreground">{med.frequency}</td>
                            <td className="p-2 text-muted-foreground">{med.duration}</td>
                            <td className="p-2 text-right">
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
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-muted/30 p-3 rounded-xl border border-border/40">
                  <div className="sm:col-span-1">
                    <input
                      type="text"
                      value={medName}
                      onChange={(e) => setMedName(e.target.value)}
                      placeholder="Medicine name"
                      className="w-full px-2.5 py-1.5 border border-border rounded-lg bg-card text-xs"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={medDosage}
                      onChange={(e) => setMedDosage(e.target.value)}
                      placeholder="e.g. 500mg, 1 tablet"
                      className="w-full px-2.5 py-1.5 border border-border rounded-lg bg-card text-xs"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={medFreq}
                      onChange={(e) => setMedFreq(e.target.value)}
                      placeholder="e.g. Twice daily"
                      className="w-full px-2.5 py-1.5 border border-border rounded-lg bg-card text-xs"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={medDur}
                      onChange={(e) => setMedDur(e.target.value)}
                      placeholder="e.g. 7 days"
                      className="w-full px-2.5 py-1.5 border border-border rounded-lg bg-card text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddMedicine}
                      className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground p-1.5 rounded-lg border border-primary/20 transition-all font-bold text-xs flex items-center justify-center"
                      title="Add to Prescription"
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
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90 font-bold transition-all duration-200 shadow-md shadow-primary/20 flex items-center justify-center gap-2 text-sm"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Submit Treatment & Complete Session</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="h-full min-h-[350px] border border-dashed border-border rounded-2xl flex flex-col items-center justify-center p-8 text-center text-muted-foreground bg-card/10">
              <Clipboard className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <h4 className="font-bold text-sm text-foreground">Consultation Room Closed</h4>
              <p className="text-xs max-w-sm mt-1">
                Select a patient from the queue on the left by clicking <strong>Treat Patient</strong> to open the treatment panel and write prescriptions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
