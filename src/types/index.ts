export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'doctor' | 'student';
  matricula?: string;
  carrera?: string;
  phone?: string;
  createdAt: Date;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  type: 'deportiva' | 'academica' | 'cultural';
  maxCapacity: number;
  currentEnrollment: number;
  startDate: Date;
  endDate: Date;
  schedule: string;
  location: string;
  createdBy: string;
  status: 'active' | 'inactive' | 'completed';
}

export interface Enrollment {
  id: string;
  studentId: string;
  activityId: string;
  enrollmentDate: Date;
  status: 'enrolled' | 'completed' | 'dropped';
  attendance: AttendanceRecord[];
}

export interface AttendanceRecord {
  id: string;
  enrollmentId: string;
  date: Date;
  attended: boolean;
  validatedBy?: string;
}

export interface ScholarshipRequest {
  id: string;
  studentId: string;
  type: 'academica' | 'economica' | 'deportiva';
  description: string;
  documents: string[];
  requestDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewDate?: Date;
  comments?: string;
}

export interface MedicalAppointment {
  id: string;
  studentId: string;
  doctorId: string;
  scheduledDate: Date;
  reason: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  diagnosis?: string;
}

export interface Certificate {
  id: string;
  studentId: string;
  activityId: string;
  type: 'participation' | 'completion';
  issueDate: Date;
  validatedBy: string;
}

export interface Report {
  id: string;
  type: 'activity_participation' | 'scholarship_summary' | 'attendance' | 'medical_appointments';
  generatedBy: string;
  generatedAt: Date;
  data: any;
  filters: Record<string, any>;
}