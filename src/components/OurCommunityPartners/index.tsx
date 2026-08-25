"use client";

import React, { useRef, useCallback, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { COMMUNITY_PARTNERS, CommunityPartner } from "@/data/communityPartners";

const SPRING_CONFIG = { damping: 30, stiffness: 120, mass: 0.8 };

function CommunityPartnerCard({
  partner,
  index,
  mouseX,
  mouseY,
}: {
  partner: CommunityPartner;
  index: number;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
}) {
  const depth = (index - 1) * 10;
  const springX = useSpring(mouseX, SPRING_CONFIG);
  const springY = useSpring(mouseY, SPRING_CONFIG);

  const translateX = useTransform(springX, [-0.5, 0.5], [-depth * 0.4, depth * 0.4]);
  const translateY = useTransform(springY, [-0.5, 0.5], [-depth * 0.4, depth * 0.4]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [depth * 0.08, -depth * 0.08]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-depth * 0.08, depth * 0.08]);

  return (
    <motion.div
      className="w-[240px] sm:w-[270px] md:w-[300px] lg:w-[320px] h-[190px] sm:h-[220px] md:h-[240px] lg:h-[260px] rounded-2xl overflow-hidden bg-white/20 backdrop-blur-xl border border-white/30 shadow-[0_8px_32px_0_rgba(255,255,255,0.08)] flex flex-col items-center justify-center p-6 md:p-8 hover:border-white/50 hover:bg-white/30 transition-all duration-300 flex-shrink-0 group"
      style={{
        x: translateX,
        y: translateY,
        rotateX,
        rotateY,
        transformPerspective: 800,
        willChange: "transform",
      }}
      whileHover={{ scale: 1.05, transition: { duration: 0.25 } }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <Image
          src={partner.logo}
          alt={partner.name}
          fill
          className="object-contain p-4 brightness-110 drop-shadow-md transition-transform duration-300 group-hover:scale-105"
          sizes="360px"
        />
      </div>
      <span className="mt-2 text-xs md:text-sm font-sans font-semibold tracking-wider text-white/80 uppercase select-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {partner.name}
      </span>
    </motion.div>
  );
}

export default function OurCommunityPartners() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-transparent text-white select-none py-20 md:py-32 px-6 md:px-12 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[700px] h-[350px] md:h-[450px] bg-[#9333ea]/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center mb-12 md:mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center font-sans font-black uppercase tracking-wide leading-[0.92] text-center"
          style={{ fontSize: "clamp(2.5rem, 6.5vw, 6.5rem)" }}
        >
          <span className="block text-white">OUR</span>
          <span className="block text-[#F0ABFC]">COMMUNITY PARTNERS</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-6 md:mt-8 max-w-xl text-white/70 text-sm md:text-base font-sans font-normal leading-relaxed text-center"
        >
          Partnering with vibrant student clubs, pioneering tech initiatives, and grassroots communities to empower tomorrow’s builders.
        </motion.p>
      </div>

      {/* Cards Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 flex flex-wrap items-center justify-center gap-6 md:gap-10 max-w-6xl mx-auto w-full"
      >
        {COMMUNITY_PARTNERS.map((partner, index) => (
          <CommunityPartnerCard
            key={`comm-partner-${partner.id}`}
            partner={partner}
            index={index}
            mouseX={mouseX}
            mouseY={mouseY}
          />
        ))}
      </motion.div>
    </section>
  );
}
