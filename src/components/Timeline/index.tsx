"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { milestones } from "@/data/timeline";

export default function Timeline() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollYProgress = useMotionValue(0);

  const progressSpring = useSpring(scrollYProgress, isMobile ? {
    stiffness: 300,
    damping: 40,
    restDelta: 0.001
  } : {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  });

  useEffect(() => {
    if (!mounted) return;

    let ticking = false;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const startPos = viewportHeight * 0.5;
      const currentPos = startPos - rect.top;
      const totalDist = rect.height;

      const progress = Math.max(0, Math.min(1, currentPos / totalDist));
      scrollYProgress.set(progress);
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    handleScroll();

    const timer = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      clearTimeout(timer);
    };
  }, [mounted, scrollYProgress]);

  // Dimension Constants
  const DESKTOP_STEP = 850;
  const MOBILE_STEP = 300;

  const totalHeight = milestones.length * (isMobile ? MOBILE_STEP : DESKTOP_STEP);
  const stepHeight = isMobile ? MOBILE_STEP : DESKTOP_STEP;
  const amplitude = 150;

  // X coordinate formula: straight line on left (x=24) for mobile, sine wave for desktop
  const getX = (y: number) => {
    if (isMobile) return 24;
    return 500 + amplitude * Math.sin(y * (Math.PI / stepHeight) + Math.PI);
  };

  // Motion transforms
  const yPosition = useTransform(progressSpring, [0, 1], [0, totalHeight], { clamp: true });
  const xPosition = useTransform(yPosition, (y) => getX(y));
  const lineProgress = useTransform(yPosition, [0, totalHeight], [0, 1], { clamp: true });

  // Generate SVG path (straight vertical line on mobile, serpentine wave on desktop)
  const generatePath = () => {
    if (isMobile) {
      return `M 24 0 L 24 ${totalHeight}`;
    }
    let path = "";
    for (let y = 0; y <= totalHeight; y += 15) {
      const x = getX(y);
      if (y === 0) path += `M ${x.toFixed(2)} ${y}`;
      else path += ` L ${x.toFixed(2)} ${y}`;
    }
    return path;
  };

  const fullPathD = generatePath();

  return (
    <section
      id="timeline-section"
      ref={containerRef}
      style={{ height: `${totalHeight}px` }}
      className={`relative w-full bg-transparent text-white select-none overflow-visible pt-16 pb-32 ${
        isMobile ? "mb-12" : "mb-32"
      }`}
    >
      {/* Central SVG Timeline Line */}
      <div className={`absolute inset-y-0 pointer-events-none z-10 overflow-visible ${
        isMobile ? "left-0 w-full" : "left-1/2 -translate-x-1/2 w-full max-w-[1000px]"
      }`}>
        {mounted && (
          <svg
            viewBox={isMobile ? `0 0 375 ${totalHeight}` : `0 0 1000 ${totalHeight}`}
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
            style={{ willChange: "transform", transform: "translateZ(0)" }}
          >
            <defs>
              <linearGradient id="line-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="35%" stopColor="#C076EC" />
                <stop offset="70%" stopColor="#572CE6" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>

              <linearGradient id="mobile-line-gradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={totalHeight}>
                <stop offset="0%" stopColor="#FAF8F5" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#FAF8F5" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#FAF8F5" stopOpacity="0.45" />
              </linearGradient>
            </defs>

            {/* Background trace line */}
            <path
              d={fullPathD}
              fill="none"
              stroke={isMobile ? "url(#mobile-line-gradient)" : "rgba(255, 255, 255, 0.08)"}
              strokeWidth={isMobile ? "4" : "3"}
            />

            {/* Animated active drawing line */}
            <motion.path
              d={fullPathD}
              fill="none"
              stroke="url(#line-gradient)"
              strokeWidth={isMobile ? "5" : "4.5"}
              style={{ pathLength: lineProgress }}
            />

            {/* Milestone static checkpoint indicators */}
            {milestones.map((_, idx) => {
              const yVal = (idx + 0.5) * stepHeight;
              const xVal = getX(yVal);
              return (
                <g key={idx}>
                  <circle
                    cx={xVal}
                    cy={yVal}
                    r={isMobile ? "9" : "14"}
                    fill={isMobile ? "#16003b" : "none"}
                    stroke={isMobile ? "#FAF8F5" : "rgba(255, 255, 255, 0.3)"}
                    strokeWidth={isMobile ? "2" : "1.5"}
                  />
                  <circle
                    cx={xVal}
                    cy={yVal}
                    r={isMobile ? "4" : "5"}
                    fill="#ffffff"
                    opacity="1"
                  />
                </g>
              );
            })}

            {/* Moving Active Tracker Dot */}
            <motion.circle
              cx={xPosition}
              cy={yPosition}
              r={isMobile ? "11" : "22"}
              fill="#ffffff"
              opacity="0.25"
            />
            <motion.circle
              cx={xPosition}
              cy={yPosition}
              r={isMobile ? "5" : "9"}
              fill="#ffffff"
            />
          </svg>
        )}
      </div>

      {/* Cards list overlay */}
      <div className="relative w-full max-w-[1000px] mx-auto h-full px-3 sm:px-6 md:px-12 pointer-events-none">
        {milestones.map((item, idx) => {
          const yVal = (idx + 0.5) * stepHeight;
          const isLeft = idx % 2 === 0;

          const xVal = getX(yVal);
          const xPercent = (xVal / 1000) * 100;

          let cardStyle: React.CSSProperties;
          let isTextRight: boolean;

          if (isMobile) {
            // On mobile screens: position cards to the right of the straight left line (48px offset)
            cardStyle = {
              top: `${yVal}px`,
              left: "48px",
              right: "16px",
            };
            isTextRight = false;
          } else {
            // Desktop layout
            const gapPercent = 4;
            if (isLeft) {
              cardStyle = {
                top: `${yVal}px`,
                right: `${100 - (xPercent - gapPercent)}%`,
                left: "auto",
              };
              isTextRight = true;
            } else {
              cardStyle = {
                top: `${yVal}px`,
                left: `${xPercent + gapPercent}%`,
                right: "auto",
              };
              isTextRight = false;
            }
          }

          return (
            <div
              key={idx}
              style={cardStyle}
              className={`absolute -translate-y-1/2 pointer-events-auto ${
                isMobile ? "w-auto max-w-none" : "w-[36%] max-w-[380px]"
              }`}
            >
              <motion.div
                initial={{ opacity: 0, x: isTextRight ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`flex flex-col ${
                  isTextRight ? "items-end text-right" : "items-start text-left"
                }`}
              >
                {/* Milestone Big Number */}
                <span className="font-serif italic text-5xl sm:text-7xl md:text-8xl text-white leading-none mb-2 sm:mb-3 md:mb-4 block select-none">
                  {item.number}
                </span>

                {/* Milestone Title */}
                <h3 className="font-sans font-bold text-white text-base sm:text-xl md:text-2xl tracking-wider mb-1 sm:mb-2">
                  {item.title}
                </h3>

                {/* Milestone Time */}
                <span className="font-serif italic text-base sm:text-xl md:text-2xl text-white/80 tracking-wide mb-2 sm:mb-3 block select-none">
                  {item.time}
                </span>

                {/* Milestone Description */}
                <p className="font-sans text-white/70 text-xs sm:text-sm md:text-base leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
