export type EventItem = {
  id: string;
  title: string;
  date: string;
  day: string;
  month: string;
  time: string;
  location: string;
  spotsLeft: number;
  capacityLimit: number;
  description: string;
  longDescription: string;
  highlights: string[];
};

export type BlogPost = {
  id: string;
  title: string;
  summary: string;
  body: string[];
  author: string;
  date: string;
  category: string;
};

export const impactStats = [
  { value: "28", label: "clean-ups completed" },
  { value: "1,240", label: "volunteers registered" },
  { value: "3.8k", label: "bags collected and counting" },
];

export const teamMembers = [
  {
    name: "Mariama Kamara",
    role: "Co-founder & programme lead",
    bio: "A community organiser focused on local partnerships and beach education across Freetown.",
  },
  {
    name: "Ibrahim Sesay",
    role: "Volunteer coordinator",
    bio: "Coordinates cleanup logistics, youth activations, and weekly outreach across the coast.",
  },
  {
    name: "Aminata Conteh",
    role: "Field communications",
    bio: "Documents stories from the shoreline and helps turn local action into a shared movement.",
  },
];

export const events: EventItem[] = [
  {
    id: "lumley-beach-sunrise-clean-up",
    title: "Lumley Beach sunrise clean-up",
    date: "2026-10-06",
    day: "06",
    month: "OCT",
    time: "7:00 AM",
    location: "Lumley Beach, Freetown",
    spotsLeft: 42,
    capacityLimit: 60,
    description: "Start the morning with a shoreline sweep and a community breakfast afterwards.",
    longDescription:
      "Join us for an early-morning cleanup at Lumley Beach before the heat climbs. We’ll focus on removing plastics, sorting waste for recycling, and encouraging nearby households to be part of the wave of clean coastline action.",
    highlights: ["Plastic collection and sorting", "Community breakfast after cleanup", "Volunteer briefing and safety walk"],
  },
  {
    id: "tokeh-shores-community-day",
    title: "Tokeh shores community day",
    date: "2026-10-20",
    day: "20",
    month: "OCT",
    time: "8:00 AM",
    location: "Tokeh Beach, Western Area",
    spotsLeft: 18,
    capacityLimit: 40,
    description: "A family-friendly cleanup and education day with local schools and households.",
    longDescription:
      "This community day brings together residents, students, and local groups to restore Tokeh Beach and protect the future of the shoreline. We’ll work with volunteers to sort waste, lift debris from the dunes, and talk through practical ways to reduce single-use plastics.",
    highlights: ["School and youth engagement", "Waste audit and sorting", "Beach education stations"],
  },
  {
    id: "hamilton-shoreline-sweep",
    title: "Hamilton shoreline sweep",
    date: "2026-11-03",
    day: "03",
    month: "NOV",
    time: "7:30 AM",
    location: "Hamilton Beach, Freetown",
    spotsLeft: 29,
    capacityLimit: 45,
    description: "A focused cleanup around the shoreline edge and nearby drainage points.",
    longDescription:
      "Hamilton Beach needs steady care and community ownership. This sweep is designed for volunteers who want to help clear debris, identify hotspots, and support local messaging around responsible waste disposal.",
    highlights: ["Drainage and shoreline clearing", "Community-led cleanup plan", "Post-event impact review"],
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: "what-the-tide-leaves-behind",
    title: "What the tide leaves behind",
    summary: "A reflection on how plastic waste travels from homes to shorelines and what communities can do next.",
    author: "Aminata Conteh",
    date: "12 Sep 2026",
    category: "Field notes",
    body: [
      "After every storm, the shoreline tells a story. Bottle caps, wrappers, and fragments of packaging reappear like a chorus of habits we haven’t yet changed.",
      "At Save The Beach SL, we pay attention to those patterns. We document what comes in with the tide, not just to record the problem, but to understand the systems behind it.",
      "When a community sees the waste in plain view, the conversation changes from blame to responsibility. Cleanups become a starting point for better consumption, better disposal, and better local design.",
    ],
  },
  {
    id: "small-hands-big-change",
    title: "Small hands, big change",
    summary: "Young volunteers are showing that regular action can reshape the way our beaches are cared for.",
    author: "Ibrahim Sesay",
    date: "28 Aug 2026",
    category: "Community voice",
    body: [
      "The younger volunteers who joined our last shoreline sweep came with gloves, a sense of purpose, and more curiosity than anyone expected.",
      "They were not just picking up trash; they were asking why it was there, how it got there, and what could be done to stop it from coming back.",
      "That kind of questioning is the real engine of change. When young people see their beach as a shared responsibility, they begin to carry that lesson into their homes and schools.",
    ],
  },
  {
    id: "from-trash-to-togetherness",
    title: "From trash to togetherness",
    summary: "A neighborhood cleanup reminded everyone that care for the coast is also care for each other.",
    author: "Mariama Kamara",
    date: "15 Jul 2026",
    category: "Community stories",
    body: [
      "By the end of the cleanup, the volunteers were not just tired, they were laughing and trading stories. That was when the real impact surfaced.",
      "The beach became a place where neighbors met each other again, where people from different corners of the community found common ground, and where simple action became a connection point.",
      "That is the heart of our work: not only cleaning the coast, but returning it to a public space where people feel pride and responsibility.",
    ],
  },
];
