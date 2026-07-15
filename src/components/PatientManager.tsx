'use client';

import React, { useState } from 'react';
import { Patient, MedicalRecord } from '../types/hospital';
import { 
  Search, 
  Plus, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Activity, 
  Calendar,
  AlertCircle,
  FileText,
  X,
  Droplet
} from 'lucide-react';

interface PatientManagerProps {
  patients: Patient[];
  records: MedicalRecord[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
}

export default function PatientManager({ patients, records, setPatients }: PatientManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  // New Patient Form state
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');
  const [newGender, setNewGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [newContact, setNewContact] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newBloodGroup, setNewBloodGroup] = useState('O-Positive');
  const [newAllergies, setNewAllergies] = useState('');
  const [newEmergency, setNewEmergency] = useState('');

  const bloodGroups = ['All', 'O-Positive', 'O-Negative', 'A-Positive', 'A-Negative', 'B-Positive', 'B-Negative', 'AB-Positive', 'AB-Negative'];
  const genders = ['All', 'Male', 'Female', 'Other'];

  // Handle Add Patient Submit
  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newAge || !newContact) return;

    const newPatient: Patient = {
      id: `PAT-${Date.now().toString().slice(-3)}`,
      name: newName,
      age: Number(newAge),
      gender: newGender,
      contact: newContact,
      email: newEmail || 'no-email@hospital.med',
      address: newAddress || 'N/A',
      bloodGroup: newBloodGroup,
      allergies: newAllergies ? newAllergies.split(',').map(s => s.trim()) : [],
      emergencyContact: newEmergency || 'N/A',
      diagnoses: [],
      registrationDate: new Date().toISOString().split('T')[0]
    };

    setPatients(prev => [newPatient, ...prev]);

    // Reset fields & close modal
    setNewName('');
    setNewAge('');
    setNewGender('Male');
    setNewContact('');
    setNewEmail('');
    setNewAddress('');
    setNewBloodGroup('O-Positive');
    setNewAllergies('');
    setNewEmergency('');
    setIsAddModalOpen(false);
  };

  // Filter patients
  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBlood = selectedBloodGroup === 'All' || p.bloodGroup === selectedBloodGroup;
    const matchesGender = selectedGender === 'All' || p.gender === selectedGender;
    return matchesSearch && matchesBlood && matchesGender;
  });

  const activePatient = patients.find(p => p.id === selectedPatientId);
  // Get medical records for active patient
  const activePatientRecords = records.filter(r => r.patientId === selectedPatientId);

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 premium-card">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto flex-1">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search patients by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 premium-input"
            />
          </div>

          {/* Gender Filter */}
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="premium-input py-2 px-3 text-muted-foreground font-bold"
          >
            {genders.map(g => (
              <option key={g} value={g}>{g === 'All' ? 'All Genders' : g}</option>
            ))}
          </select>

          {/* Blood group filter */}
          <select
            value={selectedBloodGroup}
            onChange={(e) => setSelectedBloodGroup(e.target.value)}
            className="premium-input py-2 px-3 text-muted-foreground font-bold"
          >
            {bloodGroups.map(bg => (
              <option key={bg} value={bg}>{bg === 'All' ? 'All Blood Groups' : bg}</option>
            ))}
          </select>
        </div>

        {/* Add Patient Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full md:w-auto premium-btn premium-btn-primary py-2.5 px-4 text-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Register Patient</span>
        </button>
      </div>

      {/* Patients Data Table / Card list split */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Patients Table list */}
        <div className={`${selectedPatientId ? 'xl:col-span-7' : 'xl:col-span-12'} transition-all duration-300`}>
          <div className="premium-card overflow-hidden">
            <div className="p-4 border-b border-border/60 font-bold text-sm bg-muted/20 text-foreground">
              Patient Registry ({filteredPatients.length} Active Records)
            </div>
            
            <div className="overflow-x-auto">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Demographics</th>
                    <th>Blood Group</th>
                    <th>Contact</th>
                    <th className="text-right">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground font-semibold">
                        No patients matching search parameters.
                      </td>
                    </tr>
                  ) : (
                    filteredPatients.map((patient) => (
                      <tr 
                        key={patient.id} 
                        onClick={() => setSelectedPatientId(patient.id)}
                        className={`cursor-pointer transition-colors ${
                          selectedPatientId === patient.id ? 'bg-primary/5' : ''
                        }`}
                      >
                        <td className="font-bold text-muted-foreground">{patient.id}</td>
                        <td>
                          <div className="font-bold text-sm text-foreground">{patient.name}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">Registered: {patient.registrationDate}</div>
                        </td>
                        <td>
                          <div className="font-medium">{patient.gender}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">Age: {patient.age}</div>
                        </td>
                        <td>
                          <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded-full font-bold">
                            <Droplet className="h-3 w-3" />
                            {patient.bloodGroup}
                          </span>
                        </td>
                        <td>
                          <div className="font-medium">{patient.contact}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">{patient.email}</div>
                        </td>
                        <td className="text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPatientId(patient.id);
                            }}
                            className="premium-btn premium-btn-secondary px-3 py-1.5 text-[11px]"
                          >
                            Medical Chart
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Selected Patient Medical Chart Details side screen */}
        {selectedPatientId && activePatient && (
          <div className="xl:col-span-5 space-y-6">
            <div className="premium-card p-6 relative animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Close Button */}
              <button 
                onClick={() => setSelectedPatientId(null)}
                className="absolute right-4 top-4 p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/80 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Title / Identity header */}
              <div className="flex items-center gap-3.5 border-b border-border pb-5 mb-5">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {activePatient.name.split(' ').map(n=>n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <span>{activePatient.name}</span>
                    <span className="text-[10px] bg-muted px-2 py-0.5 rounded font-bold text-muted-foreground">{activePatient.id}</span>
                  </h3>
                  <p className="text-xs text-muted-foreground">Demographics: {activePatient.gender} • {activePatient.age} years old</p>
                </div>
              </div>

              {/* Patient Profile Specs */}
              <div className="grid grid-cols-2 gap-4 text-xs mb-6">
                <div className="space-y-1">
                  <span className="text-muted-foreground font-semibold flex items-center gap-1"><Phone className="h-3 w-3" /> Contact</span>
                  <span className="font-bold">{activePatient.contact}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground font-semibold flex items-center gap-1"><Mail className="h-3 w-3" /> Email</span>
                  <span className="font-bold truncate block">{activePatient.email}</span>
                </div>
                <div className="space-y-1 col-span-2">
                  <span className="text-muted-foreground font-semibold flex items-center gap-1"><MapPin className="h-3 w-3" /> Address</span>
                  <span className="font-bold block">{activePatient.address}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground font-semibold block">Blood Type</span>
                  <span className="font-bold text-rose-500">{activePatient.bloodGroup}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground font-semibold block">Emergency Contact</span>
                  <span className="font-bold truncate block" title={activePatient.emergencyContact}>{activePatient.emergencyContact}</span>
                </div>
                <div className="space-y-1 col-span-2">
                  <span className="text-rose-500 font-semibold flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Allergies
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {activePatient.allergies.length === 0 ? (
                      <span className="text-xs text-muted-foreground font-semibold">No drug or food allergies on record.</span>
                    ) : (
                      activePatient.allergies.map((alg, i) => (
                        <span key={i} className="text-[10px] font-bold bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded-full">
                          {alg}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Medical Diagnosis Summary */}
              <div className="space-y-4 border-t border-border pt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Clinical Chart History</h4>
                
                {/* Active/Current Treatment */}
                <div className="p-3 bg-teal-500/5 border border-teal-500/20 rounded-xl text-xs">
                  <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold block uppercase tracking-wider mb-1">Active Treatment Plan</span>
                  <p className="font-bold text-foreground">
                    {activePatient.currentTreatment || 'No active treatments listed.'}
                  </p>
                </div>

                {/* Chronic Diagnoses */}
                <div className="space-y-1.5">
                  <span className="text-xs text-muted-foreground font-semibold block">Known Diagnoses</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activePatient.diagnoses.length === 0 ? (
                      <span className="text-xs text-muted-foreground font-semibold">No past diagnoses recorded.</span>
                    ) : (
                      activePatient.diagnoses.map((diag, i) => (
                        <span key={i} className="text-[10px] font-bold bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded-full">
                          {diag}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Medical Records / Consultation Logs */}
                <div className="space-y-3">
                  <span className="text-xs text-muted-foreground font-bold flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-primary" />
                    Consultation Records ({activePatientRecords.length})
                  </span>
                  
                  {activePatientRecords.length === 0 ? (
                    <p className="text-xs text-muted-foreground font-semibold py-4 text-center border border-dashed border-border rounded-xl">
                      No treatment logs found for this patient.
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                      {activePatientRecords.map((rec) => (
                        <div key={rec.id} className="p-3 rounded-xl border border-border bg-muted/20 text-xs space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-primary">{rec.diagnosis}</span>
                            <span className="text-[9px] text-muted-foreground font-mono">{rec.date}</span>
                          </div>
                          <p className="text-muted-foreground leading-relaxed italic">
                            &quot;{rec.notes}&quot;
                          </p>
                          {/* Prescription inline */}
                          {rec.prescription && rec.prescription.length > 0 && (
                            <div className="pt-2 border-t border-border/50 space-y-1">
                              <span className="text-[9px] uppercase font-bold text-muted-foreground block">Prescribed Medicines:</span>
                              <div className="space-y-1">
                                {rec.prescription.map((med, idx) => (
                                  <div key={idx} className="flex justify-between text-[10px]">
                                    <span className="font-semibold text-foreground">{med.medicine} - {med.dosage}</span>
                                    <span className="text-muted-foreground">{med.frequency} ({med.duration})</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {/* Vitals summary inline */}
                          <div className="pt-1.5 flex gap-3 text-[9px] text-muted-foreground font-semibold bg-muted/40 p-1.5 rounded">
                            <span>BP: {rec.vitals.bloodPressure}</span>
                            <span>HR: {rec.vitals.heartRate} bpm</span>
                            <span>Temp: {rec.vitals.temperature}°F</span>
                            <span>Wt: {rec.vitals.weight} lbs</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Patient Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg premium-card p-6 relative animate-in zoom-in-95 duration-200">
            {/* Modal Close */}
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/80"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <span>Register New Patient Profile</span>
            </h3>

            <form onSubmit={handleAddPatient} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Martha Wayne"
                    className="w-full premium-input"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Age *</label>
                  <input
                    type="number"
                    required
                    value={newAge}
                    onChange={(e) => setNewAge(e.target.value)}
                    placeholder="e.g. 35"
                    className="w-full premium-input"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Gender *</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as any)}
                    className="w-full premium-input font-bold text-muted-foreground"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Blood Group *</label>
                  <select
                    value={newBloodGroup}
                    onChange={(e) => setNewBloodGroup(e.target.value)}
                    className="w-full premium-input font-bold text-muted-foreground"
                  >
                    {bloodGroups.filter(b=>b!=='All').map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Contact Phone *</label>
                  <input
                    type="text"
                    required
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    placeholder="e.g. +1 (555) 019-3221"
                    className="w-full premium-input"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="e.g. martha@domain.com"
                    className="w-full premium-input"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Address</label>
                  <input
                    type="text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="e.g. Gotham Heights, Apt 2C"
                    className="w-full premium-input"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Allergies (comma-separated)</label>
                  <input
                    type="text"
                    value={newAllergies}
                    onChange={(e) => setNewAllergies(e.target.value)}
                    placeholder="e.g. Peanuts, Aspirin, Ibuprofen"
                    className="w-full premium-input"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Emergency Contact & Phone</label>
                  <input
                    type="text"
                    value={newEmergency}
                    onChange={(e) => setNewEmergency(e.target.value)}
                    placeholder="e.g. John Doe (+1 555-443-2211)"
                    className="w-full premium-input"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="premium-btn premium-btn-secondary px-4 py-2 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="premium-btn premium-btn-primary px-5 py-2 text-xs"
                >
                  Register Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
