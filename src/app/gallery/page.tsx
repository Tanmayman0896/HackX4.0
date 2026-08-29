"use client";

import { AnimatePresence, motion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { memo, useCallback, useEffect, useState } from "react";
import WaterRippleImage from "@/components/WaterRippleImage";

const getImageUrl = (imagePath: string) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  return imagePath
    .replace("/assets/images/", "/assets/images/gallery/")
    .replace(/\.(avif|jpe?g)$/i, ".webp");
};
const RAW_PROJECTS = [
  {
    id: "02",
    title: "Late Night Sprint",
    category: "Hacking",
    image: "/assets/images/pic2_converted.avif",
    description: "Intense late-night coding sessions as hackers build, test, and debug their prototypes under the clock.",
    hoverText: [
      { text: "Late Night " },
      { text: "Sprint" }
    ],
  },
  {
    id: "03",
    title: "Team Synergy",
    category: "Collaboration",
    image: "/assets/images/pic3_converted.avif",
    description: "Collaborative problem solving and creative teamwork at the hacker workstations.",
    hoverText: [
      { text: "Team " },
      { text: "Synergy" }
    ],
  },
  {
    id: "04",
    title: "Organizing Team",
    category: "Community",
    image: "/assets/images/pic4_converted.avif",
    description: "The dedicated organizing team and student leads behind the seamless execution of MUJ HackX.",
    hoverText: [
      { text: "Organizing " },
      { text: "Team" }
    ],
  },
  {
    id: "05",
    title: "Grand Inauguration",
    category: "Ceremony",
    image: "/assets/images/pic6_converted.avif",
    description: "Unveiling HackX with opening keynotes, prestigious university leaders, and cash prize announcements.",
    hoverText: [
      { text: "Grand " },
      { text: "Inauguration" }
    ],
  },
  {
    id: "06",
    title: "Keynote Address",
    category: "Keynote",
    image: "/assets/images/pic7_converted.avif",
    description: "Inspiring speeches and mentorship from distinguished university leaders and technology pioneers.",
    hoverText: [
      { text: "Keynote " },
      { text: "Address" }
    ],
  },
  {
    id: "07",
    title: "Faculty Mentors",
    category: "Guidance",
    image: "/assets/images/pic8_converted.avif",
    description: "Dedicated faculty advisors guiding participants through the hackathon journey.",
    hoverText: [
      { text: "Faculty " },
      { text: "Mentors" }
    ],
  },
  {
    id: "08",
    title: "Guest of Honour",
    category: "Keynote",
    image: "/assets/images/pic9_converted.avif",
    description: "Distinguished guests sharing insights on the future of tech, entrepreneurship, and innovation.",
    hoverText: [
      { text: "Guest of " },
      { text: "Honour" }
    ],
  },
  {
    id: "09",
    title: "Faculty Felicitation",
    category: "Recognition",
    image: "/assets/images/pic10_converted.avif",
    description: "Honoring our faculty coordinators and mentors for their invaluable leadership and dedication.",
    hoverText: [
      { text: "Faculty " },
      { text: "Felicitation" }
    ],
  },
  {
    id: "10",
    title: "Opening Address",
    category: "Ceremony",
    image: "/assets/images/pic11_converted.avif",
    description: "Welcoming hackers, mentors, and sponsors to MUJ's premier 36-hour hackathon.",
    hoverText: [
      { text: "Opening " },
      { text: "Address" }
    ],
  },
  {
    id: "11",
    title: "Mentorship Round",
    category: "Mentorship",
    image: "/assets/images/pic12_converted.avif",
    description: "Industry experts providing 1-on-1 technical feedback, architecture reviews, and pitch guidance.",
    hoverText: [
      { text: "Mentorship " },
      { text: "Round" }
    ],
  },
  {
    id: "12",
    title: "Victory Moment",
    category: "Awards",
    image: "/assets/images/pic14_converted.avif",
    description: "Celebrating top performing hackathon teams awarded with certificates and prizes on stage.",
    hoverText: [
      { text: "Victory " },
      { text: "Moment" }
    ],
  },
  {
    id: "13",
    title: "Lead Conveners",
    category: "Leadership",
    image: "/assets/images/pic15_converted.avif",
    description: "Recognizing student conveners and core leads for orchestrating the event from start to finish.",
    hoverText: [
      { text: "Lead " },
      { text: "Conveners" }
    ],
  },
  {
    id: "14",
    title: "Hardware Hacks",
    category: "Innovation",
    image: "/assets/images/pic16_converted.avif",
    description: "Autonomous drone systems and IoT hardware prototypes brought to life during the hackathon.",
    hoverText: [
      { text: "Hardware " },
      { text: "Hacks" }
    ],
  },
  {
    id: "16",
    title: "Media & Radio",
    category: "Outreach",
    image: "/assets/images/image_converted.avif",
    description: "Live event broadcasting and campus-wide media coverage in partnership with Radio Manipal.",
    hoverText: [
      { text: "Media & " },
      { text: "Radio" }
    ],
  },
  {
    id: "17",
    title: "Podium Finishers",
    category: "Awards",
    image: "/assets/images/WhatsApp Image 2026-07-21 at 09.04.16_converted.avif",
    description: "Celebrating winning teams as they receive their grand cash prize cheques.",
    hoverText: [
      { text: "Podium " },
      { text: "Finishers" }
    ],
  },
  {
    id: "18",
    title: "Dignitary Panel",
    category: "Ceremony",
    image: "/assets/images/WhatsApp Image 2026-07-21 at 09.04.16 (1)_converted.avif",
    description: "University leadership and esteemed guests seated at the opening ceremony.",
    hoverText: [
      { text: "Dignitary " },
      { text: "Panel" }
    ],
  },
  {
    id: "19",
    title: "Inaugural Speech",
    category: "Keynote",
    image: "/assets/images/WhatsApp Image 2026-07-21 at 09.04.17_converted.avif",
    description: "Setting the tone for 36 hours of non-stop creativity, code, and community.",
    hoverText: [
      { text: "Inaugural " },
      { text: "Speech" }
    ],
  },
  {
    id: "20",
    title: "HackX Arena",
    category: "Experience",
    image: "/assets/images/WhatsApp Image 2026-07-21 at 09.04.17 (1)_converted.avif",
    description: "Capturing memories at the iconic HackX experiential photo zone.",
    hoverText: [
      { text: "HackX " },
      { text: "Arena" }
    ],
  },
  {
    id: "21",
    title: "The HackX Family",
    category: "Community",
    image: "/assets/images/WhatsApp Image 2026-07-21 at 09.04.18_converted.avif",
    description: "Over 50+ student organizers, volunteers, and faculty who made HackX a massive success.",
    hoverText: [
      { text: "The HackX " },
      { text: "Family" }
    ],
  },
  {
    id: "22",
    title: "Grand Champions",
    category: "Awards",
    image: "/assets/images/WhatsApp Image 2026-07-21 at 09.04.18 (1)_converted.avif",
    description: "Overall champion teams awarded with trophies and grand prize cheques on stage.",
    hoverText: [
      { text: "Grand " },
      { text: "Champions" }
    ],
  },
  {
    id: "23",
    title: "Full House",
    category: "Audience",
    image: "/assets/images/WhatsApp Image 2026-07-21 at 09.04.18 (2)_converted.avif",
    description: "An auditorium packed with enthusiastic student developers from across the nation.",
    hoverText: [
      { text: "Full " },
      { text: "House" }
    ],
  },
  {
    id: "24",
    title: "Main Stage",
    category: "Ceremony",
    image: "/assets/images/WhatsApp Image 2026-07-21 at 09.04.19_converted.avif",
    description: "The central stage where ideas were pitched, demos were judged, and champions were crowned.",
    hoverText: [
      { text: "Main " },
      { text: "Stage" }
    ],
  },
  {
    id: "25",
    title: "Hackathon Spirit",
    category: "Audience",
    image: "/assets/images/WhatsApp Image 2026-07-21 at 09.04.19 (1)_converted.avif",
    description: "Hundreds of innovators united by their passion to build transformative technologies.",
    hoverText: [
      { text: "Hackathon " },
      { text: "Spirit" }
    ],
  },
  {
    id: "27",
    title: "Builder Mindset",
    category: "Hacking",
    image: "/assets/images/WhatsApp Image 2026-07-21 at 10.01.12 copy.jpeg",
    description: "The grit, focus, and dedication of hackers turning vision into code.",
    hoverText: [
      { text: "Builder " },
      { text: "Mindset" }
    ],
  },
];

const FILTERS = [
  ["All projects", "27"],
  ["CGI Production", "9"],
  ["Brand Design", "4"],
  ["Film", "4"],
  ["Campaign", "4"],
  ["Experiential", "6"],
];

const PROJECTS = RAW_PROJECTS.map((project) => ({
  ...project,
  image: getImageUrl(project.image),
}));

type Project = (typeof PROJECTS)[number];

const GalleryCard = memo(function GalleryCard({
  project,
  isActive,
  isDimmed,
  priority,
  onEnter,
  onLeave,
}: {
  project: Project;
  isActive: boolean;
  isDimmed: boolean;
  priority: boolean;
  onEnter: (project: Project) => void;
  onLeave: () => void;
}) {
  return (
    <article className="mb-4 md:mb-2 break-inside-avoid [contain:paint]">
      <motion.div
        aria-label={project.title}
        className="overflow-hidden bg-transparent transition-opacity duration-500 relative"
        style={{
          opacity: isDimmed ? 0.3 : 1,
          clipPath: "url(#gallery-scroll-clip)",
          WebkitClipPath: "url(#gallery-scroll-clip)",
          transform: "translateZ(0)",
        }}
        onPointerEnter={() => onEnter(project)}
        onPointerLeave={onLeave}
        onPointerCancel={onLeave}
      >
        <WaterRippleImage imageUrl={project.image} isActive={isActive} priority={priority} />
      </motion.div>
      {/* Mobile-only title below image matching reference design */}
      <h4 className="mt-2 text-xs sm:text-sm font-semibold tracking-wide text-[#faebac]/90 md:hidden leading-snug">
        {project.title}
      </h4>
    </article>
  );
});

export default function Home() {
  const [hoveredProject, setHoveredProject] = useState<typeof PROJECTS[0] | null>(null);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 45, stiffness: 300 });

  const scrollClipPathD = useTransform(smoothVelocity, (v) => {
    const normalized = Math.max(-1, Math.min(1, v / 250));
    const bend = (0.035 * Math.abs(normalized)).toFixed(4);

    let topCornerY: string;
    let topCtrlY: string;
    let botCornerY: string;
    let botCtrlY: string;

    if (normalized >= 0) {
      // Scrolling DOWN -> inverted U arch ∩ (subtle, refined curve)
      topCornerY = bend;
      topCtrlY = "0.0000";
      botCornerY = "1.0000";
      botCtrlY = (1 - Number(bend)).toFixed(4);
    } else {
      // Scrolling UP -> U trough ∪ (subtle, refined curve)
      topCornerY = "0.0000";
      topCtrlY = bend;
      botCornerY = (1 - Number(bend)).toFixed(4);
      botCtrlY = "1.0000";
    }

    return `M 0 ${topCornerY} C 0.3 ${topCtrlY}, 0.7 ${topCtrlY}, 1 ${topCornerY} L 1 ${botCornerY} C 0.7 ${botCtrlY}, 0.3 ${botCtrlY}, 0 ${botCornerY} Z`;
  });

  useEffect(() => {
    void import("jquery").then(() => import("jquery.ripples"));
  }, []);

  const handleEnter = useCallback((project: Project) => {
    setHoveredProject(project);
  }, []);

  const handleLeave = useCallback(() => {
    setHoveredProject(null);
  }, []);

  return (
    <main className="min-h-screen-stable overflow-x-clip bg-transparent text-[#f3f0e6] relative">
      {/* Static Purple Nebula Background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#070210]">
        {/* Deep Cosmic Purple & Indigo Nebula Glows */}
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 20% 15%, rgba(147, 51, 234, 0.35) 0%, rgba(88, 28, 135, 0.18) 45%, transparent 70%),
              radial-gradient(ellipse 70% 50% at 85% 35%, rgba(192, 132, 252, 0.25) 0%, rgba(126, 34, 206, 0.15) 40%, transparent 65%),
              radial-gradient(circle 600px at 50% 65%, rgba(168, 85, 247, 0.28) 0%, rgba(79, 70, 229, 0.12) 50%, transparent 75%),
              radial-gradient(ellipse 60% 70% at 30% 85%, rgba(217, 70, 239, 0.2) 0%, rgba(109, 40, 217, 0.1) 45%, transparent 70%),
              radial-gradient(ellipse 90% 80% at 75% 90%, rgba(99, 102, 241, 0.22) 0%, rgba(58, 12, 163, 0.15) 50%, transparent 75%)
            `,
          }}
        />

        {/* Soft Nebula Dust Texture Glows */}
        <div
          className="absolute inset-0 opacity-40 mix-blend-screen"
          style={{
            background: `
              radial-gradient(circle 350px at 40% 25%, rgba(236, 72, 153, 0.25), transparent 70%),
              radial-gradient(circle 450px at 70% 60%, rgba(168, 85, 247, 0.3), transparent 70%),
              radial-gradient(circle 300px at 15% 70%, rgba(129, 140, 248, 0.2), transparent 70%)
            `,
            filter: "blur(40px)",
          }}
        />

        {/* Ambient Vignette Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(4,1,12,0.6)_100%)]" />
      </div>

      <svg className="fixed pointer-events-none opacity-0 w-0 h-0" aria-hidden="true">
        <defs>
          <clipPath id="gallery-scroll-clip" clipPathUnits="objectBoundingBox">
            <motion.path d={scrollClipPathD} />
          </clipPath>
        </defs>
      </svg>


      <AnimatePresence initial={false}>
        {hoveredProject && (
          <motion.div
            key={hoveredProject.id + '-hover'}
            className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center mix-blend-difference"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className="w-full max-w-[1100px] px-6 text-center sm:px-10 lg:px-0">
              <h2 className="font-sans leading-none [font-size:clamp(2rem,6vw,5.5rem)] font-bold tracking-[0.06em] text-[#faebac] select-none inline-block transform scale-y-[1.12] origin-center">
                {hoveredProject.hoverText.map((part, i) => (
                  <span key={i}>{part.text}</span>
                ))}
              </h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="relative z-20 mx-auto w-full max-w-[1100px] px-3 sm:px-10 lg:px-0 pb-28 pt-24 sm:pt-48">
        <div className="grid grid-cols-2 gap-3 md:block md:columns-2 md:gap-2">
          {PROJECTS.map((project, index) => (
            <GalleryCard
              key={project.id}
              project={project}
              isActive={hoveredProject?.id === project.id}
              isDimmed={Boolean(hoveredProject && hoveredProject.id !== project.id)}
              priority={index < 7}
              onEnter={handleEnter}
              onLeave={handleLeave}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
