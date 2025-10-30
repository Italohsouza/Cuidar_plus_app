
export type NavItem = 'dashboard' | 'medication' | 'exams' | 'follow' | 'history';

export enum MedicationStatus {
  Taken = 'taken',
  Due = 'due',
  Overdue = 'overdue',
}

export interface Medication {
  id: number;
  name: string;
  dosage: string;
  time: string;
  status: MedicationStatus;
  owner?: string; // For caregiver view
}

export enum ExamStatus {
  Scheduled = 'scheduled',
  Completed = 'completed',
  Canceled = 'canceled',
}

export interface Exam {
  id: number;
  name: string;
  date: string;
  time: string;
  location: string;
  preparation?: string;
  status: ExamStatus;
}

export interface AdherenceData {
  day: string;
  taken: number;
  missed: number;
}

export enum ServiceType {
  Ride = 'carona',
  Companion = 'acompanhante',
  RideAndCompanion = 'carona+acompanhante',
}

export interface ServiceRequest {
  id: number;
  requester: string;
  avatar: string;
  type: ServiceType;
  origin: string;
  destination: string;
  time: string;
  value: number;
  rating: number;
}

export interface MedicalRecord {
  id: number;
  type: 'exam' | 'appointment';
  title: string;
  date: string;
  details?: string;
  imageUrl?: string;
}