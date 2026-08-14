"use client";

import React from "react";
import { motion } from "framer-motion";
import Stats from "@/components/Stats";
import SdgComponent from "@/components/sdg";
import SdgMarquee from "@/components/SdgMarquee";
import Sponsors from "@/components/Sponsors";
import GlassPill from "@/components/GlassPill";
import JoinHackathon from "@/components/JoinHackathon";
import PrizePoolCircle from "@/components/PrizePoolCircle";

export default function Home() {
  // Smooth staggered entry animations
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.25,
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

  const accentVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <>
      <div id="hero-section" className="relative w-full min-h-screen-stable md:h-screen-stable flex flex-col items-center justify-center bg-transparent overflow-x-hidden overflow-y-auto md:overflow-hidden px-4 sm:px-6 md:px-12 select-none pt-24 pb-12 md:py-0">

        {/* Relative container to keep typography and its side accents grouped and close */}
        <div className="relative flex flex-col items-center justify-center max-w-[85vw] md:max-w-[70vw] mt-4 md:mt-0 md:-translate-y-14">
          {/* Main Center Typography Group */}
          <motion.h1
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center font-sans font-medium uppercase tracking-normal leading-[0.85] text-center text-[#FAF8F5]"
            style={{
              fontSize: "clamp(1.8rem, 5.4vw, 5.6rem)",
            }}
          >
            <div className="overflow-visible pb-0">
              <motion.div variants={lineVariants} className="block origin-bottom">
                <GlassPill className="text-[0.26em] md:text-[0.22em] tracking-[0.15em] uppercase">
                  DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING, SCSE, FOSTA
                </GlassPill>
              </motion.div>
            </div>
            <div className="overflow-visible pt-1 pb-2 md:pt-1 md:pb-3 mt-0">
              <motion.div variants={lineVariants} className="block origin-bottom">
                <div className="relative inline-flex items-center justify-center px-3 py-1.5 md:px-4 md:py-2">
                  {/* Top-left corner */}
                  <span className="absolute left-0 top-0 h-2 w-2 md:h-2.5 md:w-2.5 border-t-[3px] border-l-[3px] border-white" />
                  {/* Top-right corner */}
                  <span className="absolute right-0 top-0 h-2 w-2 md:h-2.5 md:w-2.5 border-t-[3px] border-r-[3px] border-white" />
                  {/* Bottom-left corner */}
                  <span className="absolute left-0 bottom-0 h-2 w-2 md:h-2.5 md:w-2.5 border-b-[3px] border-l-[3px] border-white" />
                  {/* Bottom-right corner */}
                  <span className="absolute right-0 bottom-0 h-2 w-2 md:h-2.5 md:w-2.5 border-b-[3px] border-r-[3px] border-white" />
                  <span className="font-sans font-bold uppercase tracking-[0.3em] text-[#FAF8F5] text-[12px] sm:text-[14px] md:text-[16px]">
                    PRESENTS
                  </span>
                </div>
              </motion.div>
            </div>
            <div className="overflow-visible py-0">
              <motion.div variants={lineVariants} className="block origin-bottom">
                <div className="relative inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/logos/hackx-white.svg"
                    alt="MUJ HackX 4.0"
                    className="w-[70vw] max-w-[600px] md:w-[50vw] md:max-w-[760px] h-auto mx-auto select-none pointer-events-none"
                    draggable={false}
                  />
                  <div className="absolute -top-3 -right-2 sm:-top-4 sm:-right-4 md:-top-4 md:right-[5%] z-30">
                    <PrizePoolCircle />
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="overflow-visible pb-3 w-full -mt-6 sm:-mt-8 md:-mt-10">
              <motion.div variants={lineVariants} className="flex items-center justify-between w-full gap-3 sm:gap-4">
                <div className="h-[1.5px] flex-1 bg-[#F0ABFC]" />
                <span className="font-serif font-normal normal-case tracking-wide text-lg sm:text-2xl md:text-3xl lg:text-[2.2rem] leading-normal text-white whitespace-nowrap pt-0.5 pb-2 pr-4 inline-block flex-shrink-0">
                  MUJ&apos;s Largest Hackathon!
                </span>
              </motion.div>
            </div>
          </motion.h1>

          {/* Subtitle description matching HackX 3.0 format */}
          <motion.p
            variants={accentVariants}
            initial="hidden"
            animate="visible"
            className="mt-6 md:mt-8 max-w-xl text-center font-sans font-bold uppercase text-xs sm:text-sm md:text-base leading-relaxed tracking-wider text-white/90 px-4"
          >
          </motion.p>

          {/* REGISTER NOW Button (Mobile View Only) */}
          <motion.div
            variants={accentVariants}
            initial="hidden"
            animate="visible"
            className="block md:hidden mt-6 md:mt-8"
          >
            <a
              href="#register"
              className="inline-block transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <GlassPill className="text-[13px] sm:text-[15px] md:text-[16px] tracking-[0.2em] font-bold px-8 py-3.5 hover:bg-white/20">
                REGISTER NOW
              </GlassPill>
            </a>
          </motion.div>

          {/* Bottom Left Accent (corresponds to Since 2020) */}
          <motion.div
            variants={accentVariants}
            initial="hidden"
            animate="visible"
            className="absolute left-[-1.5vw] bottom-[0.5vh] md:left-[-4vw] md:bottom-[0.5vh] font-serif italic text-xs md:text-sm text-white hover:opacity-80 transition-opacity pointer-events-auto cursor-default whitespace-nowrap"
          >

          </motion.div>

          {/* Middle/Bottom Right Accent (corresponds to VN | CN | FR) */}
          <motion.div
            variants={accentVariants}
            initial="hidden"
            animate="visible"
            className="absolute right-[-1.5vw] bottom-[0.5vh] md:right-[-4vw] md:bottom-[0.5vh] font-serif italic text-xs md:text-sm tracking-widest text-white hover:opacity-80 transition-opacity pointer-events-auto cursor-default flex flex-col md:flex-row items-center gap-1.5 md:gap-3 whitespace-nowrap"
          >
            <span></span>
            <span className="hidden md:inline text-white/30"></span>
            <span></span>
          </motion.div>
        </div>

        {/* SDG Marquee at the bottom of the hero (visible on mobile below REGISTER NOW) */}
        <div className="w-full z-20 mt-8 sm:mt-10 md:mt-0 md:absolute md:bottom-2 lg:bottom-4 left-0">
          <SdgMarquee />
        </div>
      </div>

      <Stats />
      <JoinHackathon />
      <SdgComponent />
      <Sponsors />
    </>
  );
}
