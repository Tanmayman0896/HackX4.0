export interface Milestone {
  number: string;
  title: string;
  time: string;
  description: string;
  date?: string;
  day?: string;
}

export const milestones: Milestone[] = [
  {
    number: "1.",
    title: "REGISTRATION & CHECK-IN",
    time: "07:00 AM – 11:00 AM",
    description: "Get your badges, goodie bags, and settle into your hacking stations.",
    date: "Friday — 11 September 2026",
    day: "Day 1",
  },
  {
    number: "2.",
    title: "OPENING CEREMONY",
    time: "11:00 AM – 12:00 PM",
    description: "Kick off HackX 4.0 with the official opening ceremony.",
    date: "Friday — 11 September 2026",
    day: "Day 1",
  },
  {
    number: "3.",
    title: "PROBLEM STATEMENT RELEASE",
    time: "12:00 PM ONWARDS",
    description: "The problem statements are live. Let the 36-hour build begin.",
    date: "Friday — 11 September 2026",
    day: "Day 1",
  },
  {
    number: "4.",
    title: "MENTORING SESSION 1",
    time: "05:30 PM ONWARDS",
    description: "Get expert guidance and turn your ideas into stronger solutions.",
    date: "Friday — 11 September 2026",
    day: "Day 1",
  },
  {
    number: "5.",
    title: "ROUND 2 SUBMISSION",
    time: "06:00 AM",
    description: "The clock stops here. Submit your project before the deadline.",
    date: "Saturday — 12 September 2026",
    day: "Day 2",
  },
  {
    number: "6.",
    title: "PROJECT EVALUATION",
    time: "06:00 AM – 08:00 AM",
    description: "Judges evaluate the projects and shortlist teams for the final round.",
    date: "Saturday — 12 September 2026",
    day: "Day 2",
  },
  {
    number: "7.",
    title: "FINAL EVALUATION (Round 3)",
    time: "11:00 AM – 02:30 PM",
    description: "Shortlisted teams present their projects to the final jury.",
    date: "Saturday — 12 September 2026",
    day: "Day 2",
  },
  {
    number: "8.",
    title: "CLOSING CEREMONY",
    time: "04:00 PM – 05:00 PM",
    description: "Celebrate the journey, meet the winners, and witness the prize distribution.",
    date: "Saturday — 12 September 2026",
    day: "Day 2",
  },
];
