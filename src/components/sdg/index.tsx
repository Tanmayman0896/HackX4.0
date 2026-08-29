"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Brand {
  name: string;
  displayName?: React.ReactNode;
  logo: string | React.ReactNode;
  description: string;
}

const brands: Brand[] = [
  {
    name: "Fintech",
    logo: "/assets/themes/fintech.svg",
    description: "Empowering decentralized finance, digital transactions, and next-gen banking systems.",
  },
  {
    name: "Edtech",
    logo: "/assets/themes/edtech.svg",
    description: "Transforming learning through immersive technologies, smart classrooms, and accessible education.",
  },
  {
    name: "Healthcare",
    logo: "/assets/themes/healthcare.svg",
    description: "Ensuring healthy lives, medical innovation, and digital health solutions for all.",
  },
  {
    name: "Blockchain for Social Good",
    logo: "/assets/themes/blockchian.svg",
    description: "Building decentralized protocols, Web3 ecosystems, and transparent ledger solutions for social impact.",
  },
  {
    name: "Smart Infra",
    logo: "/assets/themes/disaster.svg",
    description: "Creating intelligent urban infrastructure, smart mobility, IoT sensor grids, and resilient city systems.",
  },
  {
    name: "Supply Chain and Logistics",
    logo: "/assets/themes/supplychain.svg",
    description: "Optimizing global logistics, smart tracking, warehouse automation, and resilient supply networks.",
  },
  {
    name: "Environmental Sustainability",
    displayName: (
      <>
        Environmental <br />Sustainability
      </>
    ),
    logo: "/assets/themes/enviroment.svg",
    description: "Developing sustainable technology, green energy, waste reduction, and environmental protection systems.",
  },
  {
    name: "Cybersecurity & Defense System",
    logo: "/assets/themes/cybersecurity.svg",
    description: "Securing critical digital infrastructure, data privacy, threat intelligence, and defense systems.",
  },
  {
    name: "Open Innovation",
    logo: "/assets/themes/open_innovation.svg",
    description: "Fostering unrestricted cross-disciplinary innovation, moonshot ideas, and creative problem solving.",
  },
];

export default function SdgComponent() {
  const containerRef = useRef<HTMLElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const stackGroupRef = useRef<HTMLDivElement>(null);

  const brandRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Mobile specific refs
  const mobileSectionRef = useRef<HTMLDivElement>(null);
  const mobileStackGroupRef = useRef<HTMLDivElement>(null);
  const mobileBrandRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [settledIndex, setSettledIndex] = useState(0);
  const prevSettledIndexRef = useRef(0);
  const activeIndexRef = useRef(0);
  const mobileActiveIndexRef = useRef(0);
  const prevMobileIndexRef = useRef(0);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  // Fast, decoupled GPU-accelerated transition for mobile description cards (no React re-renders)
  const transitionMobileCard = (newIdx: number) => {
    const prevIdx = prevMobileIndexRef.current;
    if (prevIdx === newIdx) return;

    if (mobileCardRefs.current[prevIdx]) {
      gsap.to(mobileCardRefs.current[prevIdx], {
        opacity: 0,
        scale: 0.95,
        pointerEvents: "none",
        duration: 0.3,
        ease: "power2.inOut",
        overwrite: "auto",
      });
    }

    if (mobileCardRefs.current[newIdx]) {
      gsap.to(mobileCardRefs.current[newIdx], {
        opacity: 1,
        scale: 1,
        pointerEvents: "auto",
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    }

    prevMobileIndexRef.current = newIdx;
  };

  // Debounce activeIndex updates by 120ms to settle scroll targets before transitioning (desktop only)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSettledIndex(activeIndex);
    }, 120);

    return () => clearTimeout(timer);
  }, [activeIndex]);

  // Smooth, constant-speed time-based transition played when selection changes (desktop)
  useEffect(() => {
    const prevIdx = prevSettledIndexRef.current;
    if (prevIdx === settledIndex) return;

    // Desktop card transition
    if (cardRefs.current[prevIdx]) {
      gsap.to(cardRefs.current[prevIdx], {
        opacity: 0,
        filter: "blur(20px)",
        pointerEvents: "none",
        duration: 0.55,
        ease: "power2.inOut",
      });
    }

    if (cardRefs.current[settledIndex]) {
      gsap.to(cardRefs.current[settledIndex], {
        opacity: 1,
        filter: "blur(0px)",
        pointerEvents: "auto",
        duration: 0.55,
        ease: "power2.out",
      });
    }

    prevSettledIndexRef.current = settledIndex;
  }, [settledIndex]);

  const getArcPosition = (diff: number, isMobile = false) => {
    const absDiff = Math.abs(diff);
    // Radius tuned for viewport
    const R = isMobile ? 580 : 850;
    // Spacing angle in degrees
    const angleDeg = isMobile ? 14 : 9.5;
    const angleRad = (absDiff * angleDeg * Math.PI) / 180;

    // x shifts LEFT as distance from center increases
    const x = -(R - R * Math.cos(angleRad));
    // y shifts UP for items above (diff < 0) and DOWN for items below (diff > 0)
    const yMagnitude = R * Math.sin(angleRad);
    const y = diff < 0 ? -yMagnitude : diff > 0 ? yMagnitude : 0;
    const rotation = diff * angleDeg;

    return { x, y, rotation };
  };

  // Helper: get visual properties based on distance from active item
  const getVisualProps = (diff: number, isMobile = false) => {
    const absDiff = Math.abs(diff);
    return {
      scale: isMobile
        ? 1.0 - Math.min(absDiff * 0.05, 0.25)
        : 1.0 - Math.min(absDiff * 0.03, 0.2),
      opacity: isMobile
        ? absDiff === 0
          ? 1
          : Math.max(0.48 - absDiff * 0.09, 0.08)
        : absDiff === 0
        ? 1
        : Math.max(0.4 - absDiff * 0.09, 0.1),
      blur: isMobile ? 0 : Math.min(absDiff * 0.4, 2.5),
      fill: "#f9f6f0",
      stroke: "0px transparent",
    };
  };

  const scrollToBrandIndex = (idx: number, isMobile: boolean = false) => {
    const triggerEl = isMobile ? mobileSectionRef.current : sectionRef.current;
    const scrollTriggerInstance = ScrollTrigger.getAll().find(
      (st) => st.trigger === triggerEl
    );
    if (scrollTriggerInstance) {
      const startPos = scrollTriggerInstance.start;
      const endPos = scrollTriggerInstance.end;
      const scrollRange = endPos - startPos;
      const targetScroll = startPos + (idx / (brands.length - 1)) * scrollRange;
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    } else {
      if (isMobile) {
        transitionMobileCard(idx);
      } else {
        setActiveIndex(idx);
      }
    }
  };

  useGSAP(
    () => {
      if (!isReady) return;

      const mm = gsap.matchMedia();

      // Desktop layout (> 768px)
      mm.add("(min-width: 769px)", () => {
        if (!sectionRef.current) return;

        // Setup initial card states — active is index 0
        brands.forEach((_, k) => {
          if (cardRefs.current[k]) {
            gsap.set(cardRefs.current[k], {
              opacity: k === 0 ? 1 : 0,
              y: 0,
              filter: k === 0 ? "blur(0px)" : "blur(20px)",
              pointerEvents: k === 0 ? "auto" : "none",
            });
          }
        });

        brands.forEach((_, k) => {
          if (brandRefs.current[k]) {
            const diff = k - 0;
            const pos = getArcPosition(diff, false);
            const vis = getVisualProps(diff, false);

            gsap.set(brandRefs.current[k], {
              x: pos.x,
              y: pos.y,
              yPercent: -50,
              rotation: pos.rotation,
              scale: vis.scale,
              opacity: vis.opacity,
              filter: `blur(${vis.blur}px)`,
              transformOrigin: "left center",
            });
          }
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: `+=${window.innerHeight * (brands.length - 1) * 0.45}`,
            scrub: 0.5,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const progressIdx = Math.round(self.progress * (brands.length - 1));
              if (progressIdx !== activeIndexRef.current) {
                activeIndexRef.current = progressIdx;
                setActiveIndex(progressIdx);
              }
            },
          },
        });

        for (let s = 1; s < brands.length; s++) {
          for (let k = 0; k < brands.length; k++) {
            const diff = k - s;
            const pos = getArcPosition(diff, false);
            const vis = getVisualProps(diff, false);

            tl.to(
              brandRefs.current[k],
              {
                x: pos.x,
                y: pos.y,
                rotation: pos.rotation,
                scale: vis.scale,
                opacity: vis.opacity,
                filter: `blur(${vis.blur}px)`,
                duration: 1,
                ease: "none",
              },
              s - 1
            );
          }
        }

        if (sectionRef.current) {
          gsap.to(sectionRef.current, { opacity: 1, duration: 0.4 });
        }
      });

      // Mobile layout (<= 768px) - 1:1 Mirror of Desktop Design, scaled & GPU optimized
      mm.add("(max-width: 768px)", () => {
        if (!mobileSectionRef.current) return;

        // Setup initial mobile cards
        brands.forEach((_, k) => {
          if (mobileCardRefs.current[k]) {
            gsap.set(mobileCardRefs.current[k], {
              opacity: k === 0 ? 1 : 0,
              scale: k === 0 ? 1 : 0.95,
              pointerEvents: k === 0 ? "auto" : "none",
            });
          }
        });

        // Setup initial mobile brand titles
        brands.forEach((_, k) => {
          if (mobileBrandRefs.current[k]) {
            const diff = k - 0;
            const pos = getArcPosition(diff, true);
            const vis = getVisualProps(diff, true);

            gsap.set(mobileBrandRefs.current[k], {
              x: pos.x,
              y: pos.y,
              yPercent: -50,
              rotation: pos.rotation,
              scale: vis.scale,
              opacity: vis.opacity,
              transformOrigin: "left center",
            });
          }
        });

        const mobileTl = gsap.timeline({
          scrollTrigger: {
            trigger: mobileSectionRef.current,
            start: "top top",
            end: `+=${window.innerHeight * (brands.length - 1) * 0.55}`,
            scrub: 0.3,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const progressIdx = Math.round(self.progress * (brands.length - 1));
              if (progressIdx !== mobileActiveIndexRef.current) {
                mobileActiveIndexRef.current = progressIdx;
                transitionMobileCard(progressIdx);
              }
            },
          },
        });

        for (let s = 1; s < brands.length; s++) {
          for (let k = 0; k < brands.length; k++) {
            const diff = k - s;
            const pos = getArcPosition(diff, true);
            const vis = getVisualProps(diff, true);

            mobileTl.to(
              mobileBrandRefs.current[k],
              {
                x: pos.x,
                y: pos.y,
                rotation: pos.rotation,
                scale: vis.scale,
                opacity: vis.opacity,
                duration: 1,
                ease: "none",
              },
              s - 1
            );
          }
        }

        if (mobileSectionRef.current) {
          gsap.to(mobileSectionRef.current, { opacity: 1, duration: 0.3 });
        }
      });

      // Refresh ScrollTrigger to ensure accurate layout calculations
      ScrollTrigger.refresh();
    },
    { scope: containerRef, dependencies: [isReady], revertOnUpdate: true }
  );

  return (
    <section ref={containerRef} id="sdg-section" className="w-full bg-transparent select-none overflow-hidden">
      {/* Desktop View: Pinned Arc Conveyor */}
      <div
        ref={sectionRef}
        className="hidden md:flex w-full h-screen-stable relative items-center opacity-0"
      >
        {/* Brand Stack (Arc Motion Area) */}
        <div className="absolute left-[22vw] lg:left-[24vw] top-0 h-full w-[48vw] flex items-center justify-start z-20 pointer-events-none">
          <div ref={stackGroupRef} className="relative w-full">
            {brands.map((brand, idx) => (
              <div
                key={idx}
                ref={(el) => {
                  brandRefs.current[idx] = el;
                }}
                className="absolute left-0 font-sans font-semibold text-[4.6vw] lg:text-[4.2vw] tracking-normal leading-[1.04] text-[#f9f6f0] select-none cursor-pointer origin-left pointer-events-auto max-w-[42vw] overflow-visible"
                onClick={() => scrollToBrandIndex(idx, false)}
                style={{
                  transformStyle: "preserve-3d",
                  willChange: "transform, opacity, filter",
                  color: "#f9f6f0",
                }}
              >
                {brand.displayName || brand.name}
              </div>
            ))}
          </div>
        </div>

        {/* Right Active Brand Info Panel */}
        <div className="absolute right-[6.5vw] top-0 h-full w-[32vw] flex flex-col justify-center items-center z-30 pointer-events-auto">
          <h2
            className="font-sans font-medium uppercase text-[27px] sm:text-[33px] md:text-[33px] lg:text-[39px] tracking-widest text-[#f9f6f0] text-center whitespace-nowrap mb-8"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            OUR THEMES
          </h2>
          <div className="relative w-full h-[120px] flex items-center">
            {brands.map((brand, idx) => (
              <div
                key={idx}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                className="absolute left-0 w-full grid grid-cols-[1.2fr_1.6fr] items-center gap-8 lg:gap-10 pointer-events-none"
              >
                <div className="flex items-center justify-start h-full max-h-[85px]">
                  {typeof brand.logo === "string" ? (
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="h-16 md:h-20 w-auto object-contain drop-shadow-[0_0_12px_rgba(249,246,240,0.35)]"
                    />
                  ) : (
                    brand.logo
                  )}
                </div>
                <p className="font-sans text-[15px] leading-relaxed font-normal text-[#f9f6f0]/90 select-text">
                  {brand.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile View: 1:1 Mirror of Desktop Design (GPU-optimized & flash-free) */}
      <div
        ref={mobileSectionRef}
        className="block md:hidden w-full h-screen-stable relative items-center opacity-0 overflow-hidden select-none bg-transparent"
      >
        {/* Mobile Arc Motion Area */}
        <div className="absolute left-[6vw] sm:left-[8vw] top-0 h-full w-[46vw] flex items-center justify-start z-20 pointer-events-none pt-16">
          <div ref={mobileStackGroupRef} className="relative w-full">
            {brands.map((brand, idx) => (
              <div
                key={idx}
                ref={(el) => {
                  mobileBrandRefs.current[idx] = el;
                }}
                className="absolute left-0 font-sans font-bold text-[22px] xs:text-[25px] sm:text-[28px] tracking-normal leading-[1.08] text-[#f9f6f0] select-none cursor-pointer origin-left pointer-events-auto max-w-[44vw] overflow-visible"
                onClick={() => scrollToBrandIndex(idx, true)}
                style={{
                  transformStyle: "preserve-3d",
                  willChange: "transform, opacity",
                  color: "#f9f6f0",
                }}
              >
                {brand.displayName || brand.name}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Right Active Brand Info Panel */}
        <div className="absolute right-[2vw] sm:right-[4vw] top-0 h-full w-[42vw] flex flex-col justify-center items-center z-30 pointer-events-auto pt-16">
          <h2
            className="font-sans font-medium uppercase text-[20px] xs:text-[24px] sm:text-[30px] tracking-widest text-[#f9f6f0] text-center whitespace-nowrap mb-4 sm:mb-6"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            OUR THEMES
          </h2>
          <div className="relative w-full h-[180px] sm:h-[160px] flex items-center justify-center">
            {brands.map((brand, idx) => (
              <div
                key={idx}
                ref={(el) => {
                  mobileCardRefs.current[idx] = el;
                }}
                className="absolute left-0 w-full flex flex-col sm:grid sm:grid-cols-[1fr_1.5fr] items-center gap-2 sm:gap-4 pointer-events-none text-center sm:text-left"
                style={{
                  willChange: "transform, opacity",
                  opacity: idx === 0 ? 1 : 0,
                  transform: idx === 0 ? "scale(1)" : "scale(0.95)",
                  pointerEvents: idx === 0 ? "auto" : "none",
                }}
              >
                <div className="flex items-center justify-center sm:justify-start h-full max-h-[60px] sm:max-h-[70px]">
                  {typeof brand.logo === "string" ? (
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="h-12 sm:h-18 w-auto object-contain drop-shadow-[0_0_10px_rgba(249,246,240,0.3)]"
                    />
                  ) : (
                    brand.logo
                  )}
                </div>
                <p className="font-sans text-[12px] xs:text-[13px] sm:text-[15px] leading-snug sm:leading-relaxed font-normal text-[#f9f6f0]/90 select-text px-1">
                  {brand.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

