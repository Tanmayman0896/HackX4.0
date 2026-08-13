"use client";

import React, { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import About from "@/components/Ambassador/About";
import WhyApply from "@/components/Ambassador/WhyApply";
import Themes from "@/components/Themes";
import ThreeSteps from "@/components/Ambassador/ThreeSteps";
import JoinHackathon from "@/components/JoinHackathon";
import FAQ from "@/components/FAQ";

gsap.registerPlugin(ScrollTrigger);

const AMBASSADOR_FAQ_DATA = [
  {
    question: "What is the Campus Ambassador Program?",
    answer: "It is a student leadership initiative where you serve as the primary link between MUJ HackX 4.0 and your college. You will lead outreach efforts, promote the hackathon, and guide teams on your campus to register."
  },
  {
    question: "Who is eligible to apply?",
    answer: "Any undergraduate or postgraduate student currently enrolled in a college or university is eligible. We look for passionate individuals, student developers, tech club leaders, and marketing enthusiasts."
  },
  {
    question: "What are my responsibilities as a Campus Ambassador?",
    answer: "Your core responsibilities include promoting HackX 4.0 on social media, sharing registration links within your student network, encouraging teams to register, and acting as the point-of-contact for college-wide queries."
  },
  {
    question: "What incentives and perks do I get?",
    answer: "You will receive an official Certificate of Appreciation, exclusive HackX schwags, cash incentives for top-performing ambassadors based on registrations, priority entry/selection for your own team in the hackathon, and valuable network connections."
  },
  {
    question: "Is there a registration fee or commitment requirement?",
    answer: "No, joining the program is completely free. The commitment is flexible, and you can carry out outreach activities around your academic schedule."
  },
  {
    question: "How are ambassadors selected?",
    answer: "Selection is based on your application details, engagement with student communities, communication skills, and enthusiasm for technology and community building."
  }
];

export default function Ambassador() {
  const heroRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const lines = gsap.utils.toArray<HTMLElement>(".hero-line", heroRef.current);
    if (lines.length > 0) {
      gsap.fromTo(
        lines,
        { y: "100%", opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.95,
          stagger: 0.15,
          delay: 0.2,
          ease: "power3.out",
        }
      );
    }

    gsap.fromTo(
      ".hero-btn",
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.85,
        delay: 0.8,
        ease: "power2.out",
      }
    );
  }, { scope: heroRef });

  return (
    <div className="relative w-full min-h-screen-stable bg-transparent text-white flex flex-col touch-pan-y overscroll-y-contain">
      {/* Background soft glows */}
      <div
        className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] rounded-full pointer-events-none select-none z-0 filter blur-[80px] sm:blur-[150px] opacity-20"
        style={{
          background: "radial-gradient(circle, var(--color-violet) 0%, var(--color-magenta) 50%, transparent 100%)",
          transform: "translate3d(-50%, 0, 0)",
        }}
      />

      {/* Hero Section */}
      <section ref={heroRef} className="relative w-full min-h-fit md:h-screen-stable flex flex-col items-center justify-center px-2 sm:px-4 md:px-6 select-none z-10 pt-24 pb-8 md:py-0 overflow-x-hidden">
        <div className="relative flex flex-col items-center justify-center w-full max-w-[98vw] text-center">
          {/* Subtitle */}
          <div className="overflow-visible py-0.5 mb-3 sm:mb-4 md:mb-6">
            <span className="hero-line block origin-bottom font-serif italic text-white text-base sm:text-xl md:text-2xl lg:text-3xl tracking-wide">
              Be the representation of your campus!
            </span>
          </div>

          {/* Main heading */}
          <h1
            className="flex flex-col items-center justify-center font-sans font-black uppercase tracking-normal leading-[0.92] text-center w-full text-[#FAF8F5]"
            style={{
              fontSize: "clamp(2.0rem, 7.6vw, 8.2rem)",
            }}
          >
            {/* Heading Line 1 */}
            <div className="overflow-visible py-0.5 w-full">
              <span className="hero-line block origin-bottom font-extrabold text-[#FAF8F5] whitespace-nowrap">
                CAMPUS AMBASSADOR
              </span>
            </div>

            {/* Heading Line 2 */}
            <div className="overflow-visible py-0.5 w-full">
              <span className="hero-line block origin-bottom text-[#F0ABFC] font-extrabold text-[0.74em] tracking-normal whitespace-nowrap">
                OF MUJ HACKX 4.0!
              </span>
            </div>
          </h1>

          {/* Apply Now Button */}
          <div className="hero-btn mt-6 md:mt-10 pointer-events-auto">
            <Link
              href="#apply"
              className="relative inline-flex items-center justify-center px-8 py-3.5 sm:px-10 sm:py-4 rounded-full font-sans text-xs sm:text-sm font-bold tracking-widest text-white uppercase border border-white/30 bg-white/10 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.37)] transition-all duration-300 hover:bg-white/20 hover:border-white/50 hover:scale-105"
              style={{
                WebkitBackdropFilter: "blur(12px)",
              }}
            >
              APPLY NOW!
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative w-full z-10">
        <About />
      </section>

      {/* Why Should You Apply Section */}
      <section id="why-apply" className="relative w-full z-10">
        <WhyApply />
      </section>

      {/* Themes Component Section */}
      <section id="themes" className="relative w-full z-10">
        <Themes />
      </section>

      {/* Three Steps Section */}
      <section id="steps" className="relative w-full z-10">
        <ThreeSteps />
      </section>

      {/* Join Campus Ambassador Banner Section */}
      <section id="join-ambassador" className="relative w-full z-10 pt-2 pb-0 -mb-6 md:-mb-10">
        <JoinHackathon
          title="Become the"
          highlightText="Campus Ambassador!"
          href="#apply"
          buttonText="Register now"
        />
      </section>

      {/* FAQ Component Section */}
      <section id="faq" className="relative w-full z-10">
        <FAQ
          data={AMBASSADOR_FAQ_DATA}
          heading={
            <>
              Campus Ambassador <br />program faqs.
            </>
          }
        />
      </section>
    </div>
  );
}
