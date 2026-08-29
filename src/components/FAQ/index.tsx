"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqData = [
  {
    question: "Who can participate in HackX 4.0?",
    answer: "Any student currently enrolled in an undergraduate or postgraduate course at a recognized university or college is eligible to participate. We welcome hackers from all fields—developers, designers, strategists, and ideators alike!"
  },
  {
    question: "What is the team size limit?",
    answer: "You can participate in teams of 2 to 4 members. Individual registrations are not permitted as hackathons thrive on collaborative problem-solving."
  },
  {
    question: "Are there any registration fees?",
    answer: "No, participation in HackX 4.0 is completely free of charge. Hacking spaces, internet access, mentorship, food, drinks, and schwags are provided at no cost to selected participants."
  },
  {
    question: "Is the hackathon online or in-person (offline)?",
    answer: "HackX 4.0 is a fully in-person (offline) 36-hour hackathon hosted at the School of Computer Science & Engineering, Manipal University Jaipur (MUJ)."
  },
  {
    question: "What are the tracks and themes?",
    answer: "The hackathon features tracks including Fintech, Edtech, Healthcare, Blockchain for Social Good, Smart Infra, Supply Chain and Logistics, Environmental Sustainability, Cybersecurity & Defense System, and Open Innovation."
  },
  {
    question: "What prizes can we win?",
    answer: "We feature a massive prize pool comprising cash rewards for the top 3 overall teams, track-specific cash prizes, sponsor bounties, cloud credits, premium subscriptions, cool schwags (t-shirts, stickers), and certificates of achievement."
  },
  {
    question: "How does the mentoring process work?",
    answer: "Over the course of 36 hours, expert mentors from industry leaders and developer communities will make rounds to review progress, help debug issues, validate pitch structures, and provide feedback on your prototypes."
  }
];

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  data?: FAQItem[];
  heading?: React.ReactNode;
}

export default function FAQ({ data = faqData, heading }: FAQProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <section className="relative w-full py-10 md:py-24 bg-transparent text-white overflow-visible select-none">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-20">
          
          {/* Left Column: Organizer Avatar Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit flex flex-col justify-start gap-4 lg:gap-16">
            
            {/* HackX Logo */}
            <div className="w-full relative py-4">
              <div className="max-w-[240px] md:max-w-[280px] w-full relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/assets/logos/HACKX White@2x.png" 
                  alt="HACKX Logo" 
                  className="w-full h-auto object-contain filter drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] opacity-90 hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            </div>

          </div>

          {/* Right Column: Main Heading and Accordion List */}
          <div className="lg:col-span-8 flex flex-col justify-start">
            
            {/* Heading */}
            <h2 className="font-sans font-bold text-4xl md:text-5xl lg:text-6xl text-white tracking-normal mb-16 leading-[1.08] uppercase">
              {heading || (
                <>
                  Here&apos;s what you <br />need to know before <br />registering.
                </>
              )}
            </h2>

            {/* Accordion Questions List */}
            <div className="border-t border-white/10 w-full">
              {data.map((item, idx) => {
                const isExpanded = expandedIndex === idx;
                
                return (
                  <div 
                    key={idx}
                    onClick={() => toggleExpand(idx)}
                    className="border-b border-white/10 py-6 md:py-8 cursor-pointer group select-none"
                  >
                    {/* Question Row */}
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-sans text-lg md:text-xl text-white/80 group-hover:text-white transition-colors duration-300">
                        {item.question}
                      </span>
                      
                      {/* Interactive Rotating Plus Indicator */}
                      <span className="relative flex items-center justify-center w-6 h-6 flex-shrink-0 text-white/40 group-hover:text-white transition-colors duration-300">
                        <motion.span 
                          animate={{ rotate: isExpanded ? 45 : 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute w-4 h-0.5 bg-current"
                        />
                        <motion.span 
                          animate={{ rotate: isExpanded ? 135 : 90 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute w-4 h-0.5 bg-current"
                        />
                      </span>
                    </div>

                    {/* Expandable Answer details */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="font-sans text-white/60 text-sm md:text-base leading-relaxed pt-5 pr-8">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
