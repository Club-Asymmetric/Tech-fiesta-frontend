import { Event } from "@/types";

// Tech Fiesta 2025 Events
export const events: Event[] = [
  // Technical Events
  {
    id: 1,
    title: "Reverse Code",
    type: "tech" as const,
    description:
      "Write code in reverse order! If the problem is to print 'hello world', you must code it backwards. A unique challenge that tests your programming logic and creativity.",
    tags: ["Programming", "Logic", "Creative Coding"],
    price: "₹99",
    citPrice: "₹59",
  },
  {
    id: 2,
    title: "Escape Room",
    type: "tech" as const,
    description:
      "Solve interconnected problems to progress through levels. Retrieve passwords using hints and answer security questions based on clues. A digital escape room experience!",
    tags: ["Problem Solving", "Security", "Puzzles"],
    price: "₹99",
    citPrice: "₹59",
    maxTeamSize: 2,
  },
  {
    id: 3,
    title: "Prompt Engineering",
    type: "tech" as const,
    description:
      "Complete tasks using AI tools within time limits. Create responsive web pages, generate images, write compelling stories - all through effective prompt engineering.",
    tags: ["AI", "Prompt Engineering", "Creative AI"],
    price: "₹99",
    citPrice: "₹59",
  },
  {
    id: 4,
    title: "Project Presentation",
    type: "tech" as const,
    description:
      "Develop feasible solutions to given problems. Present innovative and practical approaches that effectively address requirements and demonstrate technical excellence.",
    tags: ["Presentation", "Innovation", "Problem Solving"],
    price: "₹99",
    citPrice: "₹59",
    maxTeamSize: 2,
  },
  {
    id: 5,
    title: "Tech Trivia",
    type: "tech" as const,
    description:
      "Tech Trivia is a competitive online tech quiz designed to challenge participants on core concepts in Computer Science and emerging technologies through a variety of question types. The event emphasizes not only what teams know but also how quickly and accurately they apply their knowledge under time pressure",
    tags: ["CTF", "Cryptography", "Web Security", "Competition"],
    price: "₹99",
    citPrice: "₹59",
    maxTeamSize: 2,
  },
  {
    id: 6,
    title: "UI/UX",
    type: "tech" as const,
    description:
      "Join for UI Event, an exciting online design challenge where speed, logic, and accuracy collide! Whether you're a creative mind or a tech enthusiast, this event is your chance to shine among peers, learn on the go, and win bragging rights.",
    tags: ["UI/UX", "Design", "Creativity", "Competition"],
    price: "₹99",
    citPrice: "₹59",
    maxTeamSize: 2,
  },
  
  // Non-Technical Events
  {
    id: 7,
    title: "BGMI",
    type: "non-tech" as const,
    description:
      "Battle it out in the popular mobile game BGMI! Team up, strategize, and compete for victory in an action-packed gaming tournament.",
    tags: ["Gaming", "Teamwork", "Strategy", "Competition"],
    price: "₹79",
  },
  {
    id: 8,
    title: "ADDZAP",
    type: "non-tech" as const,
    description:
      "Unleash your creativity in ADDZAP! Create and present unique advertisements for fun products, showcasing your storytelling and public speaking skills.",
    tags: ["Storytelling", "Creativity", "Public Speaking"],
    price: "₹79",
  },
  {
    id: 9,
    title: "JAM",
    type: "non-tech" as const,
    description:
      "Showcase your spontaneity in Just A Minute (JAM)! Speak on a given topic for one minute without hesitation, repetition, or deviation.",
    tags: ["Public Speaking", "Spontaneity", "Communication", "Fun"],
    price: "₹79",
  },
  {
    id: 10,
    title: "CHESS",
    type: "non-tech" as const,
    description:
      "Test your strategic thinking and patience in a classic chess tournament. Compete against fellow participants and prove your mastery of the game.",
    tags: ["Strategy", "Board Game", "Competition", "Logic"],
    price: "₹79",
  },
  {
    id: 11,
    title: "Best Photography",
    type: "non-tech" as const,
    description:
      "Capture the essence of the event! Submit your best photographs and compete for the title of Best Photographer, judged on creativity and technique.",
    tags: ["Photography", "Creativity", "Contest", "Art"],
    price: "₹79",
  },
];

// Helper functions
export const getTechEvents = (): Event[] =>
  events.filter((event) => event.type === "tech");
export const getNonTechEvents = (): Event[] =>
  events.filter((event) => event.type === "non-tech");
export const getEventById = (id: number): Event | undefined =>
  events.find((event) => event.id === id);
