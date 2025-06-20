import { Event } from "@/types";

// Dummy data for events
export const events: Event[] = [
  // Tech Events (5)
  {
    id: 1,
    title: "AI & Machine Learning Summit",
    type: "tech" as const,
    date: "2025-03-15",
    time: "10:00 AM - 4:00 PM",
    venue: "Main Auditorium",
    description:
      "Explore the latest trends in AI and ML with industry experts. Learn about neural networks, deep learning, and practical applications.",
    speakers: ["Dr. Sarah Chen", "Prof. Michael Rodriguez"],
    capacity: 200,
    registrations: 156,
    tags: ["AI", "Machine Learning", "Deep Learning"],
    image: "/images/ai-summit.jpg",
  },
  {
    id: 2,
    title: "Web Development Bootcamp",
    type: "tech" as const,
    date: "2025-03-16",
    time: "9:00 AM - 6:00 PM",
    venue: "Computer Lab A",
    description:
      "Intensive hands-on session covering modern web technologies including React, Node.js, and cloud deployment.",
    speakers: ["Alex Thompson", "Maria Garcia"],
    capacity: 50,
    registrations: 48,
    tags: ["Web Development", "React", "Node.js"],
    image: "/images/web-bootcamp.jpg",
  },
  {
    id: 3,
    title: "Cybersecurity Workshop",
    type: "tech" as const,
    date: "2025-03-17",
    time: "2:00 PM - 5:00 PM",
    venue: "Security Lab",
    description:
      "Learn about ethical hacking, penetration testing, and security best practices to protect digital assets.",
    speakers: ["James Wilson", "Dr. Lisa Park"],
    capacity: 75,
    registrations: 62,
    tags: ["Cybersecurity", "Ethical Hacking", "Security"],
    image: "/images/cybersecurity.jpg",
  },
  {
    id: 4,
    title: "Data Science & Analytics",
    type: "tech" as const,
    date: "2025-03-18",
    time: "11:00 AM - 3:00 PM",
    venue: "Data Center",
    description:
      "Dive into data visualization, statistical analysis, and predictive modeling using Python and R.",
    speakers: ["Dr. Robert Kim", "Jennifer Lee"],
    capacity: 100,
    registrations: 87,
    tags: ["Data Science", "Python", "Analytics"],
    image: "/images/data-science.jpg",
  },
  {
    id: 5,
    title: "Mobile App Development",
    type: "tech" as const,
    date: "2025-03-19",
    time: "10:00 AM - 4:00 PM",
    venue: "Mobile Lab",
    description:
      "Build cross-platform mobile applications using React Native and Flutter frameworks.",
    speakers: ["David Brown", "Sophie Martinez"],
    capacity: 60,
    registrations: 55,
    tags: ["Mobile Development", "React Native", "Flutter"],
    image: "/images/mobile-dev.jpg",
  },
  // Non-Tech Events (3)
  {
    id: 6,
    title: "Entrepreneurship & Innovation Summit",
    type: "non-tech" as const,
    date: "2025-03-20",
    time: "9:00 AM - 5:00 PM",
    venue: "Business Center",
    description:
      "Connect with successful entrepreneurs and learn about building startups, funding, and business strategy.",
    speakers: ["John Davis", "Rachel Green", "Mark Johnson"],
    capacity: 150,
    registrations: 134,
    tags: ["Entrepreneurship", "Startups", "Business"],
    image: "/images/entrepreneurship.jpg",
  },
  {
    id: 7,
    title: "Design Thinking Workshop",
    type: "non-tech" as const,
    date: "2025-03-21",
    time: "1:00 PM - 6:00 PM",
    venue: "Creative Studio",
    description:
      "Learn human-centered design principles and creative problem-solving methodologies for innovation.",
    speakers: ["Emma Taylor", "Carlos Rodriguez"],
    capacity: 80,
    registrations: 71,
    tags: ["Design Thinking", "Innovation", "Creativity"],
    image: "/images/design-thinking.jpg",
  },
  {
    id: 8,
    title: "Leadership & Communication Skills",
    type: "non-tech" as const,
    date: "2025-03-22",
    time: "10:00 AM - 2:00 PM",
    venue: "Conference Hall B",
    description:
      "Develop essential leadership qualities and effective communication strategies for professional growth.",
    speakers: ["Dr. Amanda White", "Thomas Anderson"],
    capacity: 120,
    registrations: 98,
    tags: ["Leadership", "Communication", "Professional Development"],
    image: "/images/leadership.jpg",
  },
];

// Helper functions
export const getTechEvents = (): Event[] =>
  events.filter((event) => event.type === "tech");
export const getNonTechEvents = (): Event[] =>
  events.filter((event) => event.type === "non-tech");
export const getEventById = (id: number): Event | undefined =>
  events.find((event) => event.id === id);
export const getUpcomingEvents = (): Event[] => {
  const today = new Date();
  return events.filter((event) => new Date(event.date) >= today);
};
