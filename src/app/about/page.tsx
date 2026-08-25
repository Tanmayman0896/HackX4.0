"use client";

import React from "react";
import { motion } from "framer-motion";
import WhyHackX from "@/components/WhyHackX";
import Stats from "@/components/Stats";
import OurPartners from "@/components/OurPartners";
import OurCommunityPartners from "@/components/OurCommunityPartners";

export default function AboutPage() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const lineVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.95,
        ease: [0.16, 1, 0.3, 1], // easeOutExponential
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.85,
        delay: 0.65,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="w-full min-h-screen-stable bg-transparent flex flex-col">
      {/* Hero Section */}
      <div className="w-full min-h-fit md:h-screen-stable flex flex-col items-center justify-center text-center px-6 md:px-12 select-none relative overflow-hidden pt-24 pb-8 md:py-0">
        
        {/* Centered Hero Typography */}
        <div className="relative flex flex-col items-center justify-center w-full max-w-[98vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[75vw] text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center text-center w-full"
          >
            {/* Subtitle */}
            <div className="overflow-hidden py-0.5 mb-3 sm:mb-4 md:mb-6">
              <motion.span
                variants={lineVariants}
                className="block origin-bottom font-serif italic text-white text-lg sm:text-2xl md:text-3xl lg:text-4xl tracking-wide"
              >
                Why participate in the arena of MUJ HackX 4.0?
              </motion.span>
            </div>

            {/* Main Heading */}
            <motion.h1
              className="flex flex-col items-center justify-center font-sans font-black uppercase tracking-normal leading-[0.92] text-center w-full text-[#FAF8F5]"
              style={{
                fontSize: "clamp(3.0rem, 11vw, 9.5rem)",
              }}
            >
              <div className="overflow-hidden py-0.5 w-full">
                <motion.span
                  variants={lineVariants}
                  className="block origin-bottom font-extrabold text-[#FAF8F5] whitespace-nowrap"
                >
                  WHO ARE <span className="text-[#F0ABFC]">WE?</span>
                </motion.span>
              </div>
            </motion.h1>

            {/* Subtitle Description */}
            <motion.p
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="mt-6 md:mt-8 max-w-3xl text-white text-[17px] md:text-[20px] font-sans font-normal leading-relaxed text-center"
            >
              Step into a 36-hour sandbox of pure innovation. Turn your wildest ideas into reality, 
              collaborate with exceptional minds, and pitch to leading tech founders. This is where 
              your journey accelerates.
            </motion.p>
          </motion.div>
        </div>


      </div>

      {/* Sticky Content Section */}
      <WhyHackX />

      {/* Stats Section */}
      <Stats />

      {/* Our Partners Section */}
      <OurPartners />

      {/* Our Community Partners Section */}
      <OurCommunityPartners />
    </div>
  );
}
