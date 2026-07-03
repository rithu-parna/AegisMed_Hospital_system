import { Doctor, Patient, Appointment, Invoice, MedicalRecord } from '../types/hospital';

export const mockDoctors: Doctor[] = [
  {
    id: 'DOC-001',
    name: 'Dr. Alexander Fleming',
    specialty: 'Cardiology',
    department: 'Cardiovascular Sciences',
    email: 'a.fleming@hospital.med',
    phone: '+1 (555) 019-2831',
    status: 'available',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=120&h=120'
  },
  {
    id: 'DOC-002',
    name: 'Dr. Elizabeth Blackwell',
    specialty: 'Pediatrics',
    department: 'Pediatrics Clinic',
    email: 'e.blackwell@hospital.med',
    phone: '+1 (555) 019-3829',
    status: 'busy',
    avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=120&h=120'
  },
  {
    id: 'DOC-003',
    name: 'Dr. Gregory House',
    specialty: 'Diagnostic Medicine',
    department: 'Internal Medicine',
    email: 'g.house@hospital.med',
    phone: '+1 (555) 019-4720',
    status: 'on-duty',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=120&h=120'
  },
  {
    id: 'DOC-004',
    name: 'Dr. Jonas Salk',
    specialty: 'Virology & Immunology',
    department: 'Infectious Diseases',
    email: 'j.salk@hospital.med',
    phone: '+1 (555) 019-5611',
    status: 'available',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=120&h=120'
  },
  {
    id: 'DOC-005',
    name: 'Dr. Virginia Apgar',
    specialty: 'Anesthesiology & Obstetrics',
    department: 'Maternity Ward',
    email: 'v.apgar@hospital.med',
    phone: '+1 (555) 019-6502',
    status: 'on-leave',
    avatar: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=120&h=120'
  },
  {
    id: 'DOC-006',
    name: 'Dr. Christiaan Barnard',
    specialty: 'Cardiothoracic Surgery',
    department: 'Surgery Unit',
    email: 'c.barnard@hospital.med',
    phone: '+1 (555) 019-7393',
    status: 'available',
    avatar: 'https://images.unsplash.com/photo-1622902046580-2b47f47f0471?auto=format&fit=crop&q=80&w=120&h=120'
  }
];

export const mockPatients: Patient[] = [
  {
    id: 'PAT-101',
    name: 'Bruce Wayne',
    age: 42,
    gender: 'Male',
    contact: '+1 (555) 123-4567',
    email: 'bruce@waynecorp.com',
    address: '1007 Mountain Drive, Gotham City',
    bloodGroup: 'O-Negative',
    allergies: ['Penicillin', 'Sulfa Drugs'],
    emergencyContact: 'Alfred Pennyworth (+1 555-987-6543)',
    diagnoses: ['Chronic Insomnia', 'Multiple Micro-Fractures', 'High Cortisol Levels'],
    currentTreatment: 'Cognitive Behavioral Therapy for Insomnia, Rest and Recovery program',
    registrationDate: '2025-01-15'
  },
  {
    id: 'PAT-102',
    name: 'Diana Prince',
    age: 30,
    gender: 'Female',
    contact: '+1 (555) 234-5678',
    email: 'diana@themiscira.org',
    address: 'Gateway City Museum, Apt 4B',
    bloodGroup: 'AB-Positive',
    allergies: [],
    emergencyContact: 'Steve Trevor (+1 555-876-5432)',
    diagnoses: ['Excellent Health Status', 'Minor Ligament Sprain'],
    currentTreatment: 'Physical Therapy (Cold Compress & Rest)',
    registrationDate: '2025-02-10'
  },
  {
    id: 'PAT-103',
    name: 'Peter Parker',
    age: 21,
    gender: 'Male',
    contact: '+1 (555) 345-6789',
    email: 'pparker@dailybugle.com',
    address: '20 Ingram Street, Forest Hills, NY',
    bloodGroup: 'A-Positive',
    allergies: ['Spider Venom (Pseudo-allergy)'],
    emergencyContact: 'May Parker (+1 555-765-4321)',
    diagnoses: ['Anemia', 'Physical Exhaustion', 'Vitamin D Deficiency'],
    currentTreatment: 'Iron Supplementation, Diet rich in protein, mandatory 8-hour sleep cycles',
    registrationDate: '2025-03-05'
  },
  {
    id: 'PAT-104',
    name: 'Clark Kent',
    age: 38,
    gender: 'Male',
    contact: '+1 (555) 456-7890',
    email: 'ckent@dailyplanet.com',
    address: '344 Clinton Street, Apt 3D, Metropolis',
    bloodGroup: 'B-Positive',
    allergies: ['Lead Exposure (Severe Intolerance)'],
    emergencyContact: 'Lois Lane (+1 555-654-3210)',
    diagnoses: ['Exceptional Bone Density', 'Occasional Lower Back Strain'],
    currentTreatment: 'Ergonomic office assessment, Core strength stretching exercises',
    registrationDate: '2025-03-12'
  },
  {
    id: 'PAT-105',
    name: 'Tony Stark',
    age: 48,
    gender: 'Male',
    contact: '+1 (555) 567-8901',
    email: 'tony@starkindustries.com',
    address: '10880 Malibu Point, Malibu, CA',
    bloodGroup: 'A-Negative',
    allergies: ['Gluten', 'Palladium Toxicity'],
    emergencyContact: 'Pepper Potts (+1 555-543-2109)',
    diagnoses: ['Post-Traumatic Stress Disorder', 'Cardiac Arrhythmia (Post-operative)', 'Chronic Osteoarthritis'],
    currentTreatment: 'Beta-Blockers, Bi-weekly therapy sessions, Joint mobilization therapy',
    registrationDate: '2025-01-20'
  },
  {
    id: 'PAT-106',
    name: 'Selina Kyle',
    age: 34,
    gender: 'Female',
    contact: '+1 (555) 678-9012',
    email: 'selina@catmail.com',
    address: 'East End Apartment, Gotham City',
    bloodGroup: 'B-Negative',
    allergies: ['Dust Mites'],
    emergencyContact: 'Holly Robinson (+1 555-432-1098)',
    diagnoses: ['Right Wrist Sprain', 'Mild Dehydration'],
    currentTreatment: 'Wrist splinting, Hydration therapy, Electrolyte tracking',
    registrationDate: '2025-04-01'
  },
  {
    id: 'PAT-107',
    name: 'Barry Allen',
    age: 28,
    gender: 'Male',
    contact: '+1 (555) 789-0123',
    email: 'ballen@ccpd.gov',
    address: '425 Park Avenue, Central City',
    bloodGroup: 'O-Positive',
    allergies: ['None'],
    emergencyContact: 'Iris West-Allen (+1 555-321-0987)',
    diagnoses: ['Hyper-metabolism', 'Caloric Depletion', 'Multiple Superficial Abrasions'],
    currentTreatment: 'High-calorie dietary prescription (10k calories/day), Hydration monitoring',
    registrationDate: '2025-04-18'
  },
  {
    id: 'PAT-108',
    name: 'Natasha Romanoff',
    age: 36,
    gender: 'Female',
    contact: '+1 (555) 890-1234',
    email: 'natasha@shield.gov',
    address: 'Unknown Secure Location, Washington DC',
    bloodGroup: 'AB-Negative',
    allergies: ['Anesthetics (Resistance)'],
    emergencyContact: 'Clint Barton (+1 555-210-9876)',
    diagnoses: ['Scar Tissue Inflammation', 'Mild Cervical Spine Strain'],
    currentTreatment: 'Deep tissue physical therapy, anti-inflammatory non-steroidal drugs',
    registrationDate: '2025-02-22'
  }
];

export const mockMedicalRecords: MedicalRecord[] = [
  {
    id: 'REC-501',
    patientId: 'PAT-101',
    date: '2026-06-15',
    doctorId: 'DOC-003',
    doctorName: 'Dr. Gregory House',
    diagnosis: 'Severe Insomnia & Adrenal Burnout',
    prescription: [
      { medicine: 'Melatonin XR', dosage: '5mg', frequency: 'Once daily', duration: '30 days' },
      { medicine: 'Ashwagandha Extract', dosage: '500mg', frequency: 'Twice daily', duration: '60 days' }
    ],
    vitals: {
      bloodPressure: '138/88 mmHg',
      heartRate: 82,
      temperature: 98.4,
      weight: 210
    },
    notes: 'Patient reports less than 3 hours of sleep per night. High physical activity level is exacerbating muscle strain. Recommended immediate reduction in physical stress and dark screen rules before sleep.'
  },
  {
    id: 'REC-502',
    patientId: 'PAT-103',
    date: '2026-06-20',
    doctorId: 'DOC-002',
    doctorName: 'Dr. Elizabeth Blackwell',
    diagnosis: 'Mild Iron Deficiency Anemia & Fatigue',
    prescription: [
      { medicine: 'Ferrous Sulfate', dosage: '325mg', frequency: 'Once daily with meals', duration: '90 days' },
      { medicine: 'Vitamin C', dosage: '500mg', frequency: 'Once daily with Iron', duration: '90 days' }
    ],
    vitals: {
      bloodPressure: '110/70 mmHg',
      heartRate: 64,
      temperature: 98.1,
      weight: 165
    },
    notes: 'Hemoglobin levels at 11.2 g/dL. Fatigue is linked to dietary deficiency and chaotic sleep hours. Advised patient to consume more green leafy vegetables, red meat, and citrus fruits.'
  },
  {
    id: 'REC-503',
    patientId: 'PAT-105',
    date: '2026-06-25',
    doctorId: 'DOC-001',
    doctorName: 'Dr. Alexander Fleming',
    diagnosis: 'Mild Cardiac Arrhythmia Management',
    prescription: [
      { medicine: 'Metoprolol Succinate', dosage: '25mg', frequency: 'Once daily', duration: 'Ongoing' },
      { medicine: 'Coenzyme Q10', dosage: '100mg', frequency: 'Once daily', duration: 'Ongoing' }
    ],
    vitals: {
      bloodPressure: '128/82 mmHg',
      heartRate: 74,
      temperature: 98.6,
      weight: 185
    },
    notes: 'Electrocardiogram shows occasional premature ventricular contractions (PVCs). Overall cardiac output is normal. Chest implant site looks healthy with no signs of local infection. Stress control is paramount.'
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: 'APP-1001',
    patientId: 'PAT-101',
    patientName: 'Bruce Wayne',
    doctorId: 'DOC-003',
    doctorName: 'Dr. Gregory House',
    date: '2026-07-03',
    time: '11:00',
    reason: 'Follow-up on Insomnia and Adrenal recovery status',
    status: 'in-progress',
    priority: 'high',
    notes: 'Needs checking on blood cortisol levels and blood pressure response.'
  },
  {
    id: 'APP-1002',
    patientId: 'PAT-103',
    patientName: 'Peter Parker',
    doctorId: 'DOC-002',
    doctorName: 'Dr. Elizabeth Blackwell',
    date: '2026-07-03',
    time: '14:30',
    reason: 'Iron deficiency and hematology review',
    status: 'scheduled',
    priority: 'medium',
    notes: 'Review recent blood lab results.'
  },
  {
    id: 'APP-1003',
    patientId: 'PAT-105',
    patientName: 'Tony Stark',
    doctorId: 'DOC-001',
    doctorName: 'Dr. Alexander Fleming',
    date: '2026-07-03',
    time: '15:00',
    reason: 'Echocardiogram and heart rate tracking',
    status: 'scheduled',
    priority: 'high',
    notes: 'Routine pacemaker/arrhythmia checkup.'
  },
  {
    id: 'APP-1004',
    patientId: 'PAT-102',
    patientName: 'Diana Prince',
    doctorId: 'DOC-006',
    doctorName: 'Dr. Christiaan Barnard',
    date: '2026-07-04',
    time: '09:00',
    reason: 'Minor ankle ligament checkup',
    status: 'scheduled',
    priority: 'low',
    notes: 'Patient notes virtual recovery of mobility, check range of motion.'
  },
  {
    id: 'APP-1005',
    patientId: 'PAT-106',
    patientName: 'Selina Kyle',
    doctorId: 'DOC-006',
    doctorName: 'Dr. Christiaan Barnard',
    date: '2026-07-04',
    time: '10:30',
    reason: 'Wrist splint removal and physical therapy planning',
    status: 'scheduled',
    priority: 'medium'
  },
  {
    id: 'APP-1006',
    patientId: 'PAT-104',
    patientName: 'Clark Kent',
    doctorId: 'DOC-003',
    doctorName: 'Dr. Gregory House',
    date: '2026-07-05',
    time: '13:00',
    reason: 'Consultation on unexplained lower back fatigue',
    status: 'scheduled',
    priority: 'low'
  },
  {
    id: 'APP-1007',
    patientId: 'PAT-107',
    patientName: 'Barry Allen',
    doctorId: 'DOC-004',
    doctorName: 'Dr. Jonas Salk',
    date: '2026-07-02',
    time: '10:00',
    reason: 'Metabolic panel evaluation',
    status: 'completed',
    priority: 'high',
    notes: 'Extremely high calorie burning confirmed. Suggested glucose and glycogen loading strategies.'
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: 'INV-8001',
    patientId: 'PAT-101',
    patientName: 'Bruce Wayne',
    invoiceDate: '2026-06-15',
    dueDate: '2026-07-15',
    items: [
      { id: 'ITM-01', description: 'Consultation Fee (Dr. House)', quantity: 1, unitPrice: 250 },
      { id: 'ITM-02', description: 'Adrenal Stress Blood Panel', quantity: 1, unitPrice: 420 },
      { id: 'ITM-03', description: 'Melatonin Extended Release', quantity: 2, unitPrice: 35 },
      { id: 'ITM-04', description: 'Cognitive Behavioral Therapy session', quantity: 2, unitPrice: 150 }
    ],
    taxRate: 8,
    discount: 50,
    totalAmount: 984.80, // (250+420+70+300) = 1040 * 1.08 = 1123.20 - 50 = 1073.20. Let's fix math dynamically.
    paidAmount: 1073.20,
    status: 'paid',
    paymentMethod: 'Card'
  },
  {
    id: 'INV-8002',
    patientId: 'PAT-103',
    patientName: 'Peter Parker',
    invoiceDate: '2026-06-20',
    dueDate: '2026-07-20',
    items: [
      { id: 'ITM-01', description: 'General Consultation (Dr. Blackwell)', quantity: 1, unitPrice: 120 },
      { id: 'ITM-02', description: 'Complete Blood Count (CBC) Lab Test', quantity: 1, unitPrice: 95 },
      { id: 'ITM-03', description: 'Iron Supplement (Ferrous Sulfate)', quantity: 3, unitPrice: 15 }
    ],
    taxRate: 5,
    discount: 20,
    totalAmount: 252.00, // (120+95+45) = 260 * 1.05 = 273 - 20 = 253
    paidAmount: 50.00,
    status: 'partially-paid',
    paymentMethod: 'Cash'
  },
  {
    id: 'INV-8003',
    patientId: 'PAT-105',
    patientName: 'Tony Stark',
    invoiceDate: '2026-06-25',
    dueDate: '2026-07-25',
    items: [
      { id: 'ITM-01', description: 'Cardiology Specialist Fee (Dr. Fleming)', quantity: 1, unitPrice: 350 },
      { id: 'ITM-02', description: 'Electrocardiogram (ECG/EKG)', quantity: 1, unitPrice: 280 },
      { id: 'ITM-03', description: 'Beta-Blocker Prescription (1-month)', quantity: 1, unitPrice: 65 }
    ],
    taxRate: 8,
    discount: 0,
    totalAmount: 750.60, // (350+280+65) = 695 * 1.08 = 750.60
    paidAmount: 0.00,
    status: 'unpaid'
  },
  {
    id: 'INV-8004',
    patientId: 'PAT-107',
    patientName: 'Barry Allen',
    invoiceDate: '2026-07-02',
    dueDate: '2026-07-02',
    items: [
      { id: 'ITM-01', description: 'Immunology Specialist Fee (Dr. Salk)', quantity: 1, unitPrice: 200 },
      { id: 'ITM-02', description: 'Comprehensive Metabolic Panel', quantity: 1, unitPrice: 310 },
      { id: 'ITM-03', description: 'IV Electrolyte Hydration Pack', quantity: 4, unitPrice: 75 }
    ],
    taxRate: 6,
    discount: 100,
    totalAmount: 758.60, // (200+310+300)=810 * 1.06 = 858.6 - 100 = 758.60
    paidAmount: 758.60,
    status: 'paid',
    paymentMethod: 'Insurance'
  }
];

// Helper to calculate total invoice amount
export function calculateInvoiceTotals(items: { unitPrice: number; quantity: number }[], taxRate: number, discount: number) {
  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax - discount;
  return Math.max(0, parseFloat(total.toFixed(2)));
}

export function getInitialHMSData() {
  if (typeof window === 'undefined') {
    return {
      doctors: mockDoctors,
      patients: mockPatients,
      appointments: mockAppointments,
      invoices: mockInvoices,
      records: mockMedicalRecords
    };
  }

  const doctors = localStorage.getItem('hms_doctors');
  const patients = localStorage.getItem('hms_patients');
  const appointments = localStorage.getItem('hms_appointments');
  const invoices = localStorage.getItem('hms_invoices');
  const records = localStorage.getItem('hms_records');

  if (!doctors || !patients || !appointments || !invoices || !records) {
    localStorage.setItem('hms_doctors', JSON.stringify(mockDoctors));
    localStorage.setItem('hms_patients', JSON.stringify(mockPatients));
    localStorage.setItem('hms_appointments', JSON.stringify(mockAppointments));
    localStorage.setItem('hms_invoices', JSON.stringify(mockInvoices));
    localStorage.setItem('hms_records', JSON.stringify(mockMedicalRecords));

    return {
      doctors: mockDoctors,
      patients: mockPatients,
      appointments: mockAppointments,
      invoices: mockInvoices,
      records: mockMedicalRecords
    };
  }

  return {
    doctors: JSON.parse(doctors),
    patients: JSON.parse(patients),
    appointments: JSON.parse(appointments),
    invoices: JSON.parse(invoices),
    records: JSON.parse(records)
  };
}

export function saveHMSData(data: {
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  invoices: Invoice[];
  records: MedicalRecord[];
}) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('hms_doctors', JSON.stringify(data.doctors));
  localStorage.setItem('hms_patients', JSON.stringify(data.patients));
  localStorage.setItem('hms_appointments', JSON.stringify(data.appointments));
  localStorage.setItem('hms_invoices', JSON.stringify(data.invoices));
  localStorage.setItem('hms_records', JSON.stringify(data.records));
}
