"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useLenis } from "lenis/react";
import NetflixCurtainBackground from "@/components/NetflixCurtainBackground/NetflixCurtainBackground";
import { TeamCard } from "./TeamCard";
import { TEAM_MEMBERS, TeamCategory, TeamMember } from "@/data/team";

export default function Team() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollYProgress = useMotionValue(0);
  const lenis = useLenis();

  const [selectedCategory, setSelectedCategory] = useState<TeamCategory>("EXECUTIVE");

  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    setIsMobile(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  /* ── scroll progress through the hero container ── */
  // Lenis owns the animated scroll position. Keeping this motion value in
  // sync with Lenis prevents the hero from retaining its end-state on return.
  useEffect(() => {
    const syncScrollProgress = () => {
      const container = containerRef.current;
      if (!container) return;

      const renderedScrollTop = lenis?.animatedScroll ?? window.scrollY;
      // Native scroll is exact at the document top, while Lenis can still be
      // easing its animated value. This guarantees a full hero reset there.
      const scrollTop = window.scrollY <= 1 ? 0 : renderedScrollTop;
      const containerTop = container.offsetTop;
      const scrollDistance = Math.max(container.offsetHeight - window.innerHeight, 1);
      const progress = (scrollTop - containerTop) / scrollDistance;

      scrollYProgress.set(Math.min(Math.max(progress, 0), 1));
    };

    const frame = window.requestAnimationFrame(syncScrollProgress);
    const unsubscribe = lenis?.on("scroll", syncScrollProgress);
    window.addEventListener("resize", syncScrollProgress);

    return () => {
      window.cancelAnimationFrame(frame);
      unsubscribe?.();
      window.removeEventListener("resize", syncScrollProgress);
    };
  }, [lenis, scrollYProgress]);

  // Hero curtain canvas opacity: visible → smoothly fades out
  const curtainOpacity = useTransform(scrollYProgress, [0.3, 0.7], [1, 0]);

  // Scale: 1 → 45 on desktop, 1 → 4 on mobile (prevents touch scroll blocking)
  const heroScaleDesktop = useTransform(scrollYProgress, [0, 0.7], [1, 45]);
  const heroScaleMobile = useTransform(scrollYProgress, [0, 0.7], [1, 4]);
  const heroScale = isMobile ? heroScaleMobile : heroScaleDesktop;

  // Opacity: visible → gone
  const heroOpacity = useTransform(scrollYProgress, [0.35, 0.7], [1, 0]);
  // Blur: 0px → 8px
  const heroBlur = useTransform(scrollYProgress, [0.45, 0.7], ["blur(0px)", "blur(8px)"]);

  /* ── Entry animations ── */
  const titleContainerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  };

  const lineVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.85, delay: 0.7, ease: "easeOut" },
    },
  };

  const allMembers = TEAM_MEMBERS;

  const currentMembers = useMemo(() => {
    return allMembers.filter(
      (m) => m.year === "2026" && m.category === selectedCategory
    );
  }, [allMembers, selectedCategory]);

  const subTeamGroups = useMemo(() => {
    const groups: { title: string; members: TeamMember[] }[] = [];
    const map = new Map<string, TeamMember[]>();

    currentMembers.forEach((m) => {
      const key = m.subTeam || "MEMBERS";
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(m);
    });

    map.forEach((members, title) => {
      groups.push({ title, members });
    });

    return groups;
  }, [currentMembers]);

  return (
    <div className="relative min-h-screen-stable text-white bg-[#070312] overflow-x-clip">
      {/* 1. Single Fixed Page-Wide Seamless Background Glow */}
      <div className="fixed inset-0 bg-[#070312] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1d0a3d] via-[#070312] to-[#030108] pointer-events-none z-0" />

      {/* 2. Fixed WebGL Curtain Layer with Smooth Opacity Fade */}
      <motion.div
        style={{ opacity: curtainOpacity }}
        className="fixed inset-0 pointer-events-none z-10"
      >
        <NetflixCurtainBackground scrollYProgress={scrollYProgress} />
      </motion.div>

      {/* 3. Hero Zoom Text Section */}
      <div ref={containerRef} className="relative h-[220vh] z-20">
        <div className="sticky top-0 w-full h-screen-stable flex items-center justify-center pointer-events-none">
          <motion.div
            className="flex flex-col items-center justify-center text-center px-2 sm:px-6 md:px-12 select-none"
            style={{
              scale: heroScale,
              opacity: heroOpacity,
              filter: heroBlur,
              transformOrigin: "50% 50%",
              transform: "translateZ(0)",
              willChange: "transform, opacity, filter",
            }}
          >
            <div className="relative flex flex-col items-center justify-center w-full max-w-[98vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[75vw]">
              {/* Subtitle */}
              <motion.div
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="mb-3 sm:mb-4 md:mb-6 pointer-events-auto"
              >
                <span className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif italic tracking-wide">
                  Meet the humans behind the curtains!
                </span>
              </motion.div>

              {/* Main heading */}
              <motion.h1
                variants={titleContainerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-center justify-center font-sans font-black uppercase tracking-normal leading-[0.92] text-center w-full"
                style={{ fontSize: "clamp(2.7rem, 11.5vw, 8.8rem)" }}
              >
                <div className="overflow-hidden py-0.5 w-full">
                  <motion.span
                    variants={lineVariants}
                    className="block origin-bottom font-extrabold text-[#FAF8F5] whitespace-nowrap"
                  >
                    MEET THE <span className="text-[#F0ABFC]">TEAM!</span>
                  </motion.span>
                </div>
                <div className="overflow-hidden py-0.5 w-full">
                  <motion.span
                    variants={lineVariants}
                    className="block origin-bottom text-[#FAF8F5] font-extrabold text-[0.72em] md:text-[calc(0.62em+3px)] tracking-tight whitespace-nowrap"
                  >
                    OF MUJ HACKX 4.0
                  </motion.span>
                </div>
              </motion.h1>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 4. Main Team Grid Section (Natural Document Flow) */}
      <div className="relative z-30 w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 -mt-[60vh] pb-32">
        {/* Filter Controls (Fixed above cards) */}
        <div className="flex flex-col items-center gap-4 mb-12 pb-4">
          {/* Category Filter */}
          <div className="flex items-center justify-center gap-6 sm:gap-10 pt-2">
            {(["FACULTY", "EXECUTIVE", "CORE"] as TeamCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-sm sm:text-base md:text-lg font-black tracking-widest uppercase transition-all duration-300 relative px-2 py-1 ${
                  selectedCategory === cat
                    ? "text-white scale-105"
                    : "text-white/35 hover:text-white/70"
                }`}
              >
                {cat}
                {selectedCategory === cat && (
                  <motion.div
                    layoutId="activeCategoryUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Team Grid Grouped by Subheadings or Coming Soon */}
        {selectedCategory === "FACULTY" ? (
          <div className="text-center py-24 text-white/60 text-lg sm:text-xl font-bold tracking-widest uppercase">
            Coming Soon..
          </div>
        ) : subTeamGroups.length > 0 ? (
          <div className="space-y-20 md:space-y-24 lg:space-y-28">
            {subTeamGroups.map((group) => (
              <div key={group.title} className="flex flex-col gap-6">
                {group.title !== "MEMBERS" && (
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif italic text-center text-white/90 tracking-wide mb-4 md:mb-6 pt-2">
                    {group.title}
                  </h2>
                )}
                <div className="flex flex-wrap justify-center gap-2.5 sm:gap-4 md:gap-6">
                  {group.members.map((member, i) => (
                    <motion.div
                      key={member.id || member.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "50px" }}
                      transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.3) }}
                      className="w-[calc(50%-0.35rem)] sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.15rem)] flex justify-center"
                    >
                      <TeamCard member={member} index={i} />
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-white/40 text-sm font-medium tracking-wider">
            No team members listed for {selectedCategory}.
          </div>
        )}
      </div>
    </div>
  );
}
