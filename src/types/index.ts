// Type definitions for events and workshops

export interface Event {
  id: number;
  title: string;
  type: "tech" | "non-tech";
  date: string;
  time: string;
  venue: string;
  description: string;
  speakers?: string[];
  capacity?: number;
  registrations?: number;
  tags?: string[];
  image?: string;
  price?: string; // Regular price
  citPrice?: string; // CIT student price
  maxTeamSize?: number; // Maximum team size for events that allow teams
}

export interface Workshop {
  id: number;
  title: string;
  category: string;
  level?: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  date: string;
  time: string;
  venue: string;
  instructor: string;
  description: string;
  prerequisites?: string[];
  materials?: string[];
  capacity?: number;
  registrations?: number;
  price: string; // Regular price
  citPrice?: string; // CIT student price
  tags?: string[];
  syllabus?: string[];
}

// Pass types
export interface Pass {
  id: number;
  title: string;
  description: string;
  benefits: string[];
  price: string; // Regular price
  citPrice: string; // CIT student price
  terms: string[];
  includes: string[];
}

// Registration types
export interface TeamMember {
  name: string;
  department: string;
  year: string;
  email: string;
  whatsapp: string;
}

// Selected event/workshop item structure
export interface SelectedItem {
  id: number;
  title: string;
}

export interface RegistrationFormData {
  // Primary participant details
  name: string;
  department: string;
  email: string;
  whatsapp: string;
  college: string;
  year: string;

  // Team details (conditional)
  isTeamEvent: boolean;
  teamSize?: number;
  teamMembers?: TeamMember[];

  // Event selections (storing both ID and title)
  selectedEvents: SelectedItem[];
  selectedWorkshops: SelectedItem[];
  selectedNonTechEvents: SelectedItem[];

  // Pass selection
  selectedPass?: number; // Pass ID if selected

  // Payment details
  transactionIds: Record<string, string>; // Flexible structure for individual event/workshop transaction IDs

  // Verification
  hasConsented: boolean;
}

export interface RegistrationProps {
  preSelectedEventId?: number;
  preSelectedEventType?: "event" | "workshop" | "non-tech";
}

export interface PaymentQR {
  type: "event" | "workshop" | "general";
  eventId?: number; // For individual event/workshop QRs
  eventTitle?: string;
  amount: string;
  qrCode: string;
  description: string;
}
