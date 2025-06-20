import { Workshop } from "@/types";

// Dummy data for workshops
export const workshops: Workshop[] = [
  {
    id: 1,
    title: "Introduction to Python Programming",
    category: "Programming",
    level: "Beginner" as const,
    duration: "4 hours",
    date: "2025-03-23",
    time: "9:00 AM - 1:00 PM",
    venue: "Lab Room 101",
    instructor: "Dr. Kevin Smith",
    description:
      "Learn Python fundamentals including variables, loops, functions, and basic data structures. Perfect for complete beginners.",
    prerequisites: ["Basic computer knowledge"],
    materials: ["Laptop", "Python IDE setup guide"],
    capacity: 30,
    registrations: 28,
    price: "Free",
    tags: ["Python", "Programming", "Beginner"],
    syllabus: [
      "Python syntax and basic operations",
      "Variables and data types",
      "Control structures (if/else, loops)",
      "Functions and modules",
      "Working with files",
      "Basic error handling",
    ],
  },
  {
    id: 2,
    title: "Advanced JavaScript & ES6+",
    category: "Web Development",
    level: "Intermediate" as const,
    duration: "6 hours",
    date: "2025-03-24",
    time: "10:00 AM - 4:00 PM",
    venue: "Web Dev Studio",
    instructor: "Sarah Johnson",
    description:
      "Master modern JavaScript features including arrow functions, promises, async/await, and ES6+ syntax.",
    prerequisites: ["Basic JavaScript knowledge", "HTML/CSS familiarity"],
    materials: ["Laptop", "Code editor", "Modern web browser"],
    capacity: 25,
    registrations: 22,
    price: "$50",
    tags: ["JavaScript", "ES6", "Web Development"],
    syllabus: [
      "Arrow functions and template literals",
      "Destructuring and spread operator",
      "Promises and async/await",
      "Modules and imports",
      "Classes and inheritance",
      "Modern DOM manipulation",
    ],
  },
  {
    id: 3,
    title: "UI/UX Design Fundamentals",
    category: "Design",
    level: "Beginner" as const,
    duration: "5 hours",
    date: "2025-03-25",
    time: "11:00 AM - 4:00 PM",
    venue: "Design Lab",
    instructor: "Maria Gonzalez",
    description:
      "Learn the principles of user interface and user experience design with hands-on projects using Figma.",
    prerequisites: ["Design interest", "Creative mindset"],
    materials: ["Laptop", "Figma account", "Design inspiration examples"],
    capacity: 35,
    registrations: 31,
    price: "$75",
    tags: ["UI/UX", "Design", "Figma"],
    syllabus: [
      "Design thinking principles",
      "Color theory and typography",
      "Wireframing and prototyping",
      "User research basics",
      "Figma tools and techniques",
      "Creating responsive designs",
    ],
  },
  {
    id: 4,
    title: "Docker & Containerization",
    category: "DevOps",
    level: "Intermediate" as const,
    duration: "4 hours",
    date: "2025-03-26",
    time: "1:00 PM - 5:00 PM",
    venue: "Cloud Lab",
    instructor: "Ahmed Hassan",
    description:
      "Learn containerization concepts, Docker basics, and how to deploy applications using containers.",
    prerequisites: ["Linux basics", "Command line experience"],
    materials: ["Laptop", "Docker Desktop installed", "Terminal access"],
    capacity: 20,
    registrations: 18,
    price: "$100",
    tags: ["Docker", "DevOps", "Containerization"],
    syllabus: [
      "Container concepts and benefits",
      "Docker installation and setup",
      "Creating and managing containers",
      "Dockerfile best practices",
      "Docker Compose for multi-container apps",
      "Container orchestration basics",
    ],
  },
  {
    id: 5,
    title: "Digital Marketing & Social Media",
    category: "Marketing",
    level: "Beginner" as const,
    duration: "3 hours",
    date: "2025-03-27",
    time: "2:00 PM - 5:00 PM",
    venue: "Marketing Hub",
    instructor: "Lisa Chen",
    description:
      "Discover effective digital marketing strategies and social media management techniques for businesses.",
    prerequisites: ["Basic internet knowledge", "Social media familiarity"],
    materials: ["Laptop", "Social media accounts", "Marketing case studies"],
    capacity: 40,
    registrations: 35,
    price: "$60",
    tags: ["Digital Marketing", "Social Media", "Business"],
    syllabus: [
      "Digital marketing landscape overview",
      "Social media platform strategies",
      "Content creation and curation",
      "Analytics and performance tracking",
      "Paid advertising basics",
      "Building brand presence online",
    ],
  },
];

// Helper functions
export const getWorkshopsByCategory = (category: string): Workshop[] =>
  workshops.filter((workshop) => workshop.category === category);

export const getWorkshopsByLevel = (
  level: "Beginner" | "Intermediate" | "Advanced"
): Workshop[] => workshops.filter((workshop) => workshop.level === level);

export const getWorkshopById = (id: number): Workshop | undefined =>
  workshops.find((workshop) => workshop.id === id);

export const getAvailableWorkshops = (): Workshop[] =>
  workshops.filter((workshop) => (workshop?.registrations ?? 0) < (workshop.capacity ?? 0));

export const getWorkshopCategories = (): string[] => [
  ...new Set(workshops.map((workshop) => workshop.category)),
];

export const getWorkshopLevels = (): (
  | "Beginner"
  | "Intermediate"
  | "Advanced"
)[] =>
  [...new Set(workshops.map((workshop) => workshop.level))]
    .filter((level): level is "Beginner" | "Intermediate" | "Advanced" => level !== undefined);
