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
  price: string;
  tags?: string[];
  syllabus?: string[];
}
