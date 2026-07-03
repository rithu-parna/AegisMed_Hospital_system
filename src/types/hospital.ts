export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  department: string;
  email: string;
  phone: string;
  status: 'available' | 'on-duty' | 'on-leave' | 'busy';
  avatar?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  contact: string;
  email: string;
  address: string;
  bloodGroup: string;
  allergies: string[];
  emergencyContact: string;
  diagnoses: string[];
  currentTreatment?: string;
  registrationDate: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  reason: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  invoiceDate: string;
  dueDate: string;
  items: InvoiceItem[];
  taxRate: number; // percentage
  discount: number; // flat discount amount
  totalAmount: number;
  paidAmount: number;
  status: 'paid' | 'unpaid' | 'partially-paid';
  paymentMethod?: 'Cash' | 'Card' | 'Insurance' | 'Bank Transfer';
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  date: string;
  doctorId: string;
  doctorName: string;
  diagnosis: string;
  prescription: {
    medicine: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
  vitals: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    weight: number;
  };
  notes: string;
}

export interface HospitalStats {
  totalPatients: number;
  totalAppointments: number;
  totalDoctors: number;
  totalRevenue: number;
  pendingBills: number;
  occupancyRate: number;
}
