"use client";

import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STATS_DATA = [
  {
    id: "01",
    title: "universities",
    caption: "What started as a college level hackathon has now grown into a multi-university movement, bringing together talent from 50+ universities across the country.",
    image: "https://pub-45c102ac14a64011a530ed2864a18405.r2.dev/hackx/1785920134883_ejgpg.avif",
  },
  {
    id: "02",
    title: "participants",
    caption: "Over 2000 participants have been a part of HackX across all editions, building, breaking and shipping ideas that push boundaries.",
    image: "https://pub-45c102ac14a64011a530ed2864a18405.r2.dev/hackx/1785920124566_7bh44k.avif",
  },
  {
    id: "03",
    title: "projects",
    caption: "36 hours of non-stop hacking, mentoring and building. No sleep, all code. This is where ideas become reality.",
    image: "https://pub-45c102ac14a64011a530ed2864a18405.r2.dev/hackx/1785920153789_2h6o4q.avif",
  }
];

export default function Stats() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const railDotRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const numberRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Preload image assets on client mount for instant scrub response
  useEffect(() => {
    STATS_DATA.forEach((item) => {
      const img = new Image();
      img.src = item.image;
    });
  }, []);

  const scrollToSection = (index: number) => {
    if (typeof window === "undefined") return;
    const trigger = ScrollTrigger.getById("stats-scroll-trigger");
    if (trigger) {
      const targetY = trigger.start + (index / (STATS_DATA.length - 1)) * (trigger.end - trigger.start);
      window.scrollTo({ top: targetY, behavior: "smooth" });
    } else {
      window.scrollTo({
        top: index * window.innerHeight,
        behavior: "smooth"
      });
    }
  };

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 0px)", () => {
      // Measure the image card's active container dimensions dynamically
      const cardEl = imageRefs.current[0];
      let cardWidth = 310;
      let cardHeight = 370;
      if (cardEl) {
        const rect = cardEl.getBoundingClientRect();
        if (rect.width > 0) cardWidth = rect.width;
        if (rect.height > 0) cardHeight = rect.height;
      }

      // Spacing offsets: proportional to card dimensions for elegant gaps
      const xOffsetVal = cardWidth * 1.06;
      const yOffsetVal = cardHeight * 1.06;

      // Set initial element positions
      STATS_DATA.forEach((_, idx) => {
        // Text caption position and opacity
        if (textRefs.current[idx]) {
          gsap.set(textRefs.current[idx], {
            opacity: idx === 0 ? 1 : 0,
            y: idx === 0 ? 0 : 25,
            pointerEvents: idx === 0 ? "auto" : "none",
          });
        }

        // Giant numbers position and opacity
        if (numberRefs.current[idx]) {
          gsap.set(numberRefs.current[idx], {
            opacity: idx === 0 ? 1 : 0,
            yPercent: idx === 0 ? 0 : 100,
          });
        }

        // Images along slanted conveyor positions
        if (imageRefs.current[idx]) {
          if (idx === 0) {
            gsap.set(imageRefs.current[0], {
              x: 0,
              y: 0,
              scale: 1,
              opacity: 1,
              filter: "grayscale(0%)",
              zIndex: 10,
              rotation: 0,
            });
          } else if (idx === 1) {
            gsap.set(imageRefs.current[1], {
              x: xOffsetVal,
              y: yOffsetVal,
              scale: 1,
              opacity: 0.15,
              filter: "grayscale(100%)",
              zIndex: 5,
              rotation: 0,
            });
          } else {
            const offX = xOffsetVal * 2;
            const offY = yOffsetVal * 2;
            gsap.set(imageRefs.current[idx], {
              x: offX,
              y: offY,
              scale: 1,
              opacity: 0,
              filter: "grayscale(100%)",
              zIndex: 1,
              rotation: 0,
            });
          }
        }
      });

      // Create timeline linked to ScrollTrigger pinning
      const tl = gsap.timeline({
        scrollTrigger: {
          id: "stats-scroll-trigger",
          trigger: containerRef.current,
          start: "top top",
          end: () => {
            const isMobile = window.innerWidth < 768;
            const multiplier = isMobile ? 1.8 : 1;
            return `+=${(STATS_DATA.length - 1) * window.innerHeight * multiplier}`;
          },
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          refreshPriority: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            const index = Math.round(progress * (STATS_DATA.length - 1));
            if (index !== activeIndexRef.current) {
              activeIndexRef.current = index;
              setActiveIndex(index);
            }
          },
        },
      });

      // Register section timeline labels
      STATS_DATA.forEach((_, index) => {
        tl.addLabel(`section_${index}`, index);
      });

      // Build scroll scrub animation transitions
      for (let i = 0; i < STATS_DATA.length - 1; i++) {
        const labelFrom = `section_${i}`;

        // Text caption out/in
        if (textRefs.current[i]) {
          tl.to(textRefs.current[i], {
            opacity: 0,
            y: -25,
            pointerEvents: "none",
            duration: 0.35,
            ease: "none",
          }, labelFrom);
        }

        if (textRefs.current[i + 1]) {
          tl.to(textRefs.current[i + 1], {
            opacity: 1,
            y: 0,
            pointerEvents: "auto",
            duration: 0.4,
            ease: "none",
          }, `${labelFrom}+=0.55`);
        }

        // Giant active section number out/in
        if (numberRefs.current[i]) {
          tl.to(numberRefs.current[i], {
            opacity: 0,
            yPercent: -100,
            duration: 0.8,
            ease: "power1.inOut",
          }, labelFrom);
        }

        if (numberRefs.current[i + 1]) {
          tl.to(numberRefs.current[i + 1], {
            opacity: 1,
            yPercent: 0,
            duration: 0.8,
            ease: "power1.inOut",
          }, `${labelFrom}+=0.2`);
        }

        // Conveyor transitions: current active image (i) exits to Top-Left
        if (imageRefs.current[i]) {
          tl.to(imageRefs.current[i], {
            x: -xOffsetVal,
            y: -yOffsetVal,
            scale: 1,
            opacity: 0.15,
            filter: "grayscale(100%)",
            zIndex: 1,
            rotation: 0,
            duration: 1,
            ease: "none",
          }, labelFrom);
        }

        // Previous exited image (i - 1) fades completely to 0 as it moves further Top-Left
        if (i - 1 >= 0 && imageRefs.current[i - 1]) {
          tl.to(imageRefs.current[i - 1], {
            x: -xOffsetVal * 2,
            y: -yOffsetVal * 2,
            scale: 1,
            opacity: 0,
            filter: "grayscale(100%)",
            zIndex: 1,
            rotation: 0,
            duration: 1,
            ease: "none",
          }, labelFrom);
        }

        // Next preview image (i + 1) moves to Center-Stage
        if (imageRefs.current[i + 1]) {
          tl.to(imageRefs.current[i + 1], {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            filter: "grayscale(0%)",
            zIndex: 10,
            rotation: 0,
            duration: 1,
            ease: "none",
          }, labelFrom);
        }

        // Next next image (i + 2) moves to Bottom-Right preview zone
        if (i + 2 < STATS_DATA.length && imageRefs.current[i + 2]) {
          tl.to(imageRefs.current[i + 2], {
            x: xOffsetVal,
            y: yOffsetVal,
            scale: 1,
            opacity: 0.15,
            filter: "grayscale(100%)",
            zIndex: 5,
            rotation: 0,
            duration: 1,
            ease: "none",
          }, labelFrom);
        }
      }
    });

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => clearTimeout(refreshTimer);
  }, { scope: containerRef });

  return (
    <section className="relative w-full bg-transparent overflow-hidden" id="stats-archive-page">
      <div
        ref={containerRef}
        className="relative w-full h-screen-stable overflow-hidden"
      >
        {/* Giant active section number background */}
        <div className="absolute left-4 sm:left-16 md:left-28 lg:left-40 bottom-[2vh] md:bottom-[3vh] lg:bottom-[4vh] z-30 flex items-end pointer-events-none select-none text-cream/90">
          <span className="font-sans font-medium text-[22vw] sm:text-[20vw] md:text-[18vw] lg:text-[15vw] xl:text-[13vw] leading-none">0</span>
          <div className="relative font-sans font-medium text-[22vw] sm:text-[20vw] md:text-[18vw] lg:text-[15vw] xl:text-[13vw] leading-none h-[1em] w-[0.7em] overflow-hidden">
            {STATS_DATA.map((sec, idx) => {
              const secondDigit = sec.id.charAt(1) || sec.id;
              return (
                <div
                  key={sec.id}
                  ref={(el) => { numberRefs.current[idx] = el; }}
                  className="absolute bottom-0 left-0 font-sans font-medium text-[22vw] sm:text-[20vw] md:text-[18vw] lg:text-[15vw] xl:text-[13vw] leading-none will-change-[transform,opacity]"
                  style={{ display: "block", opacity: idx === 0 ? 1 : 0 }}
                  id={`stats-number-${sec.id}`}
                >
                  {secondDigit}
                </div>
              );
            })}
          </div>
        </div>

        {/* Left-side vertical rail */}
        <nav
          className="absolute left-3 sm:left-6 md:left-12 lg:left-16 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2.5 sm:gap-4 font-sans text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] select-none"
          aria-label="Stats Navigation Rail"
        >
          {STATS_DATA.map((sec, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={sec.id}
                ref={(el) => { railDotRefs.current[idx] = el; }}
                onClick={() => scrollToSection(idx)}
                className="flex items-center gap-2 sm:gap-3 py-1.5 text-left group transition-all duration-300 pointer-events-auto touch-manipulation"
                id={`rail-link-${sec.id}`}
                aria-label={`Go to section ${sec.id} - ${sec.title}`}
              >
                {/* Number */}
                <span
                  className={`font-semibold transition-all duration-300 ${isActive ? "text-cream scale-110" : "text-cream/30 group-hover:text-cream/70"
                    }`}
                >
                  {idx + 1}
                </span>

                {/* Slide/Fade text label */}
                <span
                  className={`font-serif italic lowercase text-xs tracking-wider transition-all duration-500 overflow-hidden whitespace-nowrap ${isActive
                      ? "w-24 sm:w-32 opacity-100 text-[#faebac] translate-x-0"
                      : "w-0 opacity-0 -translate-x-2"
                    }`}
                >
                  {sec.title}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Central image archive conveyor belt */}
        <section className="relative w-full h-full flex items-center justify-center z-20 select-none">
          <div className="relative w-[230px] h-[280px] xs:w-[260px] xs:h-[320px] sm:w-[310px] sm:h-[370px] md:w-[360px] md:h-[430px] lg:w-[400px] lg:h-[480px]">
            {STATS_DATA.map((sec, idx) => (
              <article
                key={sec.id}
                ref={(el) => { imageRefs.current[idx] = el; }}
                className="absolute inset-0 w-full h-full overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.65)] rounded-sm will-change-[transform,opacity]"
                style={{
                  zIndex: idx === 0 ? 10 : 1,
                  opacity: idx === 0 ? 1 : 0
                }}
                id={`stats-article-${sec.id}`}
              >
                {/* Soft overlay vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15 pointer-events-none z-10" />
                {/* Editorial Image */}
                <img
                  src={sec.image}
                  alt={`Editorial illustration for ${sec.title}`}
                  className="w-full h-full object-cover"
                  draggable={false}
                  loading="eager"
                  decoding="async"
                />
              </article>
            ))}
          </div>
        </section>

        {/* Right-side text block (top-right below header on mobile, vertically centered on right on desktop) */}
        <aside className="absolute top-24 xs:top-28 sm:top-32 md:top-[40%] md:-translate-y-1/2 right-4 sm:right-8 md:right-16 lg:right-24 left-auto w-[220px] xs:w-[250px] sm:w-[300px] md:w-[320px] lg:w-[380px] text-right md:text-left z-40 pointer-events-none select-none">
          <div className="relative w-full h-24">
            {STATS_DATA.map((sec, idx) => (
              <div
                key={sec.id}
                ref={(el) => { textRefs.current[idx] = el; }}
                className="absolute top-0 right-0 left-0 md:-translate-y-1/2 font-serif text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-cream/90 leading-relaxed font-light pointer-events-auto"
                style={{ display: "block", opacity: idx === 0 ? 1 : 0 }}
                id={`stats-caption-${sec.id}`}
              >
                {sec.caption}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

