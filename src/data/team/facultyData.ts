import { TeamMember } from "./types";

interface FacultyRawData {
  name: string;
  role: string;
  subTeam: string;
  email?: string;
  image?: string;
  initials?: string;
}

const R2_FACULTY_BASE = "https://pub-45c102ac14a64011a530ed2864a18405.r2.dev/faculty";

const rawFacultyList: FacultyRawData[] = [
  // ── PATRONS & FACULTY ORGANIZERS ──
  {
    name: "Lt. Gen. (Dr.) M. D. Venkatesh",
    role: "Chief Patron • Chairperson",
    subTeam: "PATRONS & FACULTY ORGANIZERS",
    image: "/assets/faculty/venkatesh.jpg",
    initials: "MV",
  },
  {
    name: "Dr N N Sharma",
    role: "Patron • President",
    subTeam: "PATRONS & FACULTY ORGANIZERS",
    image: "/assets/faculty/N N Sharma.png",
    initials: "NS",
  },
  {
    name: "Dr. Nitu Bhatnagar",
    role: "Co-Patron • Provost",
    subTeam: "PATRONS & FACULTY ORGANIZERS",
    image: "/assets/faculty/nitu-bhatnagar.jpg",
    initials: "NB",
  },
  {
    name: "Dr. Amit Soni",
    role: "Co-Patron • Registrar",
    subTeam: "PATRONS & FACULTY ORGANIZERS",
    image: "/assets/faculty/Dr-Amit-Soni.jpg",
    initials: "AS",
  },
  {
    name: "Dr. Kuldip Singh Sangwan",
    role: "Organizer • Dean, FoE",
    subTeam: "PATRONS & FACULTY ORGANIZERS",
    image: `${R2_FACULTY_BASE}/Dr20Kuldip20Singh.webp`,
    initials: "KS",
  },
  {
    name: "Dr. CS Lamba",
    role: "Organizer • Director, SCSE",
    subTeam: "PATRONS & FACULTY ORGANIZERS",
    email: "cs.lamba@jaipur.manipal.edu",
    image: `${R2_FACULTY_BASE}/CS-LAMBDA.webp`,
    initials: "CL",
  },
  {
    name: "Dr. Neha Chaudhary",
    role: "Organizer • HoD, CSE",
    subTeam: "PATRONS & FACULTY ORGANIZERS",
    email: "chaudhary.neha@jaipur.manipal.edu",
    image: `${R2_FACULTY_BASE}/NEHA.webp`,
    initials: "NC",
  },

  // ── CONVENERS ──
  {
    name: "Dr. Juhi Singh",
    role: "Convener • Assistant Professor, CSE",
    subTeam: "FACULTY CONVENER",
    email: "juhi.singh@jaipur.manipal.edu",
    image: `${R2_FACULTY_BASE}/JUHI.webp`,
    initials: "JS",
  },

  // ── FACULTY COORDINATORS ──
  {
    name: "Dr. Ajay Kumar",
    role: "Faculty Coordinator",
    subTeam: "FACULTY CO-ORDINATORS",
    email: "kumar.ajay@jaipur.manipal.edu",
    image: `${R2_FACULTY_BASE}/AJAY.webp`,
    initials: "AK",
  },
  {
    name: "Mr. Lav Upadhyay",
    role: "Faculty Coordinator",
    subTeam: "FACULTY CO-ORDINATORS",
    email: "lav.upadhyay@jaipur.manipal.edu",
    image: `${R2_FACULTY_BASE}/LAV.webp`,
    initials: "LU",
  },
  {
    name: "Dr. Usha Jain",
    role: "Faculty Coordinator",
    subTeam: "FACULTY CO-ORDINATORS",
    email: "usha.jain@jaipur.manipal.edu",
    image: `${R2_FACULTY_BASE}/USHA.webp`,
    initials: "UJ",
  },
  {
    name: "Dr. Sushama Tanwar",
    role: "Faculty Coordinator",
    subTeam: "FACULTY CO-ORDINATORS",
    initials: "ST",
  },
  {
    name: "Dr. Onkar Singh",
    role: "Faculty Coordinator",
    subTeam: "FACULTY CO-ORDINATORS",
    image: "/assets/faculty/Dr. Onkar Singh.jpg",
    initials: "OS",
  },
  {
    name: "Dr. Surbhi Sharma",
    role: "Faculty Coordinator",
    subTeam: "FACULTY CO-ORDINATORS",
    email: "surbhi.sharma@jaipur.manipal.edu",
    image: `${R2_FACULTY_BASE}/SURBHI.webp`,
    initials: "SS",
  },
  {
    name: "Dr. Amandeep Cheema",
    role: "Faculty Coordinator",
    subTeam: "FACULTY CO-ORDINATORS",
    initials: "AC",
  },
  {
    name: "Dr. Mahesh Jangid",
    role: "Faculty Coordinator",
    subTeam: "FACULTY CO-ORDINATORS",
    email: "mahesh.jangid@jaipur.manipal.edu",
    image: `${R2_FACULTY_BASE}/MAHESH.webp`,
    initials: "MJ",
  },
  {
    name: "Dr. Jeyakrishnan V",
    role: "Faculty Coordinator",
    subTeam: "FACULTY CO-ORDINATORS",
    image: "/assets/faculty/Dr. Jeyakrishnan V.jpg",
    initials: "JV",
  },
  {
    name: "Dr. Bali Devi",
    role: "Faculty Coordinator",
    subTeam: "FACULTY CO-ORDINATORS",
    email: "bali.devi@jaipur.manipal.edu",
    image: `${R2_FACULTY_BASE}/BALI.webp`,
    initials: "BD",
  },
  {
    name: "Dr. Anita Shrotriya",
    role: "Faculty Coordinator",
    subTeam: "FACULTY CO-ORDINATORS",
    email: "anita.shrotriya@jaipur.manipal.edu",
    image: `${R2_FACULTY_BASE}/ANITA.webp`,
    initials: "AS",
  },
  {
    name: "Dr. Neetu Gupta",
    role: "Faculty Coordinator",
    subTeam: "FACULTY CO-ORDINATORS",
    image: "/assets/faculty/DR. NEETU GUPTA.jpg",
    initials: "NG",
  },
  {
    name: "Dr. Mayank Namdev",
    role: "Faculty Coordinator",
    subTeam: "FACULTY CO-ORDINATORS",
    email: "mayank.namdev@jaipur.manipal.edu",
    image: `${R2_FACULTY_BASE}/MAYANK.webp`,
    initials: "MN",
  },
  {
    name: "Ms. Babita Tiwari",
    role: "Faculty Coordinator",
    subTeam: "FACULTY CO-ORDINATORS",
    email: "babita.tiwari@jaipur.manipal.edu",
    image: `${R2_FACULTY_BASE}/BABITA.webp`,
    initials: "BT",
  },
  {
    name: "Ms. Soni Gupta",
    role: "Faculty Coordinator",
    subTeam: "FACULTY CO-ORDINATORS",
    initials: "SG",
  },
  {
    name: "Dr. Kumar Shashvat",
    role: "Faculty Coordinator",
    subTeam: "FACULTY CO-ORDINATORS",
    initials: "KS",
  },
  {
    name: "Dr. Susheela Vishnoi",
    role: "Faculty Coordinator",
    subTeam: "FACULTY CO-ORDINATORS",
    image: "/assets/faculty/Dr. Susheela Vishnoi.jpg",
    initials: "SV",
  },
  {
    name: "Dr. Prashant Vats",
    role: "Faculty Coordinator",
    subTeam: "FACULTY CO-ORDINATORS",
    email: "prashant.vats@jaipur.manipal.edu",
    image: `${R2_FACULTY_BASE}/PRASHANT.webp`,
    initials: "PV",
  },
  {
    name: "Dr. Satyabrata Roy",
    role: "Faculty Coordinator",
    subTeam: "FACULTY CO-ORDINATORS",
    email: "satyabrata.roy@jaipur.manipal.edu",
    image: `${R2_FACULTY_BASE}/SATYA.webp`,
    initials: "SR",
  },
  {
    name: "Dr. Amit Garg",
    role: "Faculty Coordinator",
    subTeam: "FACULTY CO-ORDINATORS",
    email: "amit.garg@jaipur.manipal.edu",
    image: `${R2_FACULTY_BASE}/AMIT.webp`,
    initials: "AG",
  },
  {
    name: "Dr. Sayar Singh Shekhawat",
    role: "Faculty Coordinator",
    subTeam: "FACULTY CO-ORDINATORS",
    email: "sayar.shekhawat@jaipur.manipal.edu",
    image: `${R2_FACULTY_BASE}/SAYAR.webp`,
    initials: "SS",
  },
  {
    name: "Dr. Arshpreet Kaur",
    role: "Faculty Coordinator",
    subTeam: "FACULTY CO-ORDINATORS",
    initials: "AK",
  },
  {
    name: "Dr. Shishir Singh Chauhan",
    role: "Faculty Coordinator",
    subTeam: "FACULTY CO-ORDINATORS",
    email: "shishir.chauhan@jaipur.manipal.edu",
    image: `${R2_FACULTY_BASE}/SHISHRI.webp`,
    initials: "SC",
  },
];

const generateFacultyForYear = (year: "2026" | "2025"): TeamMember[] => {
  return rawFacultyList.map((item, index) => ({
    id: `${year}-faculty-${index + 1}`,
    name: item.name,
    role: item.role,
    year,
    category: "FACULTY",
    subTeam: item.subTeam,
    email: item.email,
    image: item.image,
    initials: item.initials,
  }));
};

export const facultyMembers: TeamMember[] = [
  // ── 2026 FACULTY ──
  ...generateFacultyForYear("2026"),
  // ── 2025 FACULTY ──
  ...generateFacultyForYear("2025"),
];
