"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { usePathname } from "next/navigation";
import { useNavTransition } from "@/context/NavTransitionContext";

const loadCircularNebulaShader = () =>
  import("@/components/CircularNebulaShader/CircularNebulaShader");

const CircularNebulaShader = dynamic(loadCircularNebulaShader, { ssr: false });

const MENU_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Timeline", href: "/timeline" },
  { label: "Ambassador", href: "/ambassador" },
 // { label: "Team", href: "/team" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
] as const;

type MenuItemTarget = {
  filter: string;
  opacity: number;
  scale: number;
};

const RESTING_MENU_ITEM_TARGET: MenuItemTarget = {
  filter: "blur(0px)",
  opacity: 1,
  scale: 1,
};

const createMenuItemTargets = (hoveredIndex: number) =>
  MENU_ITEMS.map((_, index): MenuItemTarget => {
    const distance = Math.abs(hoveredIndex - index);

    return {
      filter: index === hoveredIndex
        ? "blur(0px)"
        : `blur(${Math.min(8, 4 + distance * 1.35)}px)`,
      opacity: index === hoveredIndex ? 1 : Math.max(0.18, 0.5 - distance * 0.055),
      scale: index === hoveredIndex ? 1.03 : 1,
    };
  });

const MENU_ITEM_HOVER_TARGETS = MENU_ITEMS.map((_, index) => createMenuItemTargets(index));
const RESTING_MENU_ITEM_TARGETS = MENU_ITEMS.map(() => RESTING_MENU_ITEM_TARGET);

const isSameMenuItemTarget = (a: MenuItemTarget | undefined, b: MenuItemTarget) =>
  a?.filter === b.filter && a.opacity === b.opacity && a.scale === b.scale;

export default function Navbar() {
  const pathname = usePathname();
  const { isOpen, setIsOpen } = useNavTransition();
  const prefersReducedMotion = useReducedMotion() ?? false;
  const isOpenRef = useRef(isOpen);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const hoverTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const menuItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const menuItemTargetsRef = useRef<(MenuItemTarget | undefined)[]>([]);
  const activeMenuItemRef = useRef<number | null>(null);
  const wasOpenRef = useRef(false);

  const getLines = useCallback(() => {
    if (line1Ref.current && line2Ref.current) {
      return [line1Ref.current, line2Ref.current];
    }
    return null;
  }, []);

  const setMenuItemRef = useCallback((node: HTMLDivElement | null, index: number) => {
    menuItemRefs.current[index] = node;
  }, []);

  const setNavBackgroundPaused = useCallback((paused: boolean) => {
    if (paused) {
      document.documentElement.dataset.navOpen = "true";
      document.body.dataset.navOpen = "true";
    } else {
      delete document.documentElement.dataset.navOpen;
      delete document.body.dataset.navOpen;
    }
  }, []);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const preload = () => void loadCircularNebulaShader();

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(preload, { timeout: 1500 });
    } else {
      timeoutId = globalThis.setTimeout(preload, 300);
    }

    return () => {
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) globalThis.clearTimeout(timeoutId);
    };
  }, []);

  const animationSpeed = prefersReducedMotion ? 0 : 1;

  const killLineAnimation = useCallback(() => {
    hoverTimelineRef.current?.kill();
    hoverTimelineRef.current = null;

    const lines = getLines();
    if (lines) gsap.killTweensOf(lines);
  }, [getLines]);

  const handleMouseEnter = () => {
    const lines = getLines();
    if (!lines) return;

    killLineAnimation();

    const tl = gsap.timeline();
    hoverTimelineRef.current = tl;
    tl.eventCallback("onComplete", () => {
      if (hoverTimelineRef.current === tl) hoverTimelineRef.current = null;
    });

    if (isOpen) {
      // Premium diagonal scissor slide-out-in (the cross "builds" itself)
      tl.to(lines[0], { x: -24, y: -24, opacity: 0, duration: 0.2 * animationSpeed, ease: "power2.in", force3D: true }, 0)
        .to(lines[1], { x: 24, y: -24, opacity: 0, duration: 0.2 * animationSpeed, ease: "power2.in", force3D: true }, 0)
        // Teleport to opposite diagonal corners
        .set(lines[0], { x: 24, y: 24, force3D: true })
        .set(lines[1], { x: -24, y: 24, force3D: true })
        // Slide back to center from opposite corners
        .to(lines[0], { x: 0, y: 0, opacity: 1, duration: 0.25 * animationSpeed, ease: "power2.out", force3D: true }, ">")
        .to(lines[1], { x: 0, y: 0, opacity: 1, duration: 0.25 * animationSpeed, ease: "power2.out", force3D: true }, "<");
    } else {
      // Top line slides right (135%), bottom line slides left (-135%)
      tl.to(lines[0], { x: "135%", duration: 0.2 * animationSpeed, ease: "power2.in", force3D: true }, 0)
        .to(lines[1], { x: "-135%", duration: 0.2 * animationSpeed, ease: "power2.in", force3D: true }, 0)
        // Teleport to opposite sides
        .set(lines[0], { x: "-135%", force3D: true })
        .set(lines[1], { x: "135%", force3D: true })
        // Slide back to center from opposite sides
        .to(lines[0], { x: "0%", duration: 0.25 * animationSpeed, ease: "power2.out", force3D: true }, ">")
        .to(lines[1], { x: "0%", duration: 0.25 * animationSpeed, ease: "power2.out", force3D: true }, "<");
    }
  };

  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateMenuItemStyles = useCallback(
    (
      targets: readonly MenuItemTarget[],
      duration: number,
      ease = "cubic-bezier(0.16, 1, 0.3, 1)"
    ) => {
      const transitionStyle = prefersReducedMotion
        ? "none"
        : `filter ${duration}s ${ease}, opacity ${duration}s ${ease}, transform ${duration}s ${ease}`;

      menuItemRefs.current.forEach((item, index) => {
        const target = targets[index];
        if (!item || !target || isSameMenuItemTarget(menuItemTargetsRef.current[index], target)) return;

        menuItemTargetsRef.current[index] = target;
        item.style.transition = transitionStyle;
        item.style.filter = target.filter;
        item.style.opacity = String(target.opacity);
        item.style.transform = target.scale === 1 ? "none" : `scale(${target.scale})`;
      });
    },
    [prefersReducedMotion]
  );

  const resetMenuItemHover = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    hoverTimeoutRef.current = setTimeout(() => {
      hoverTimeoutRef.current = null;
      if (activeMenuItemRef.current === null) return;
      activeMenuItemRef.current = null;

      updateMenuItemStyles(RESTING_MENU_ITEM_TARGETS, 0.8, "cubic-bezier(0.25, 1, 0.5, 1)");
    }, 60);
  }, [updateMenuItemStyles]);

  const handleMenuItemHover = useCallback((hoveredIndex: number) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    if (activeMenuItemRef.current === hoveredIndex) return;
    activeMenuItemRef.current = hoveredIndex;

    updateMenuItemStyles(MENU_ITEM_HOVER_TARGETS[hoveredIndex], 0.45, "cubic-bezier(0.16, 1, 0.3, 1)");
  }, [updateMenuItemStyles]);

  const handleMouseLeave = () => {
    if (!isOpen) return;
    const lines = getLines();
    if (!lines) return;

    killLineAnimation();
    // Smoothly slide back to the base cross state (45deg / -45deg)
    const tl = gsap.timeline();
    hoverTimelineRef.current = tl;
    tl.to(lines[0], { x: 0, y: 0, rotation: 45, opacity: 1, duration: 0.35 * animationSpeed, ease: "power2.out", force3D: true }, 0)
      .to(lines[1], { x: 0, y: 0, rotation: -45, opacity: 1, duration: 0.35 * animationSpeed, ease: "power2.out", force3D: true }, 0)
      .eventCallback("onComplete", () => {
        if (hoverTimelineRef.current === tl) hoverTimelineRef.current = null;
      });
  };

  const isInitialRender = useRef(true);

  // Synchronized state transformations
  useEffect(() => {
    const lines = getLines();
    if (!lines) return;

    killLineAnimation();

    if (isInitialRender.current) {
      isInitialRender.current = false;
      gsap.set(lines[0], { y: -4, rotation: 0, x: 0, opacity: 1, force3D: true });
      gsap.set(lines[1], { y: 4, rotation: 0, x: 0, opacity: 1, force3D: true });
      return;
    }

    const tl = gsap.timeline();
    hoverTimelineRef.current = tl;

    if (isOpen) {
      tl.to(lines[0], {
        y: 0,
        rotation: 45,
        x: 0,
        opacity: 1,
        duration: 0.35 * animationSpeed,
        ease: "power2.out",
        force3D: true,
      }, 0).to(lines[1], {
        y: 0,
        rotation: -45,
        x: 0,
        opacity: 1,
        duration: 0.35 * animationSpeed,
        ease: "power2.out",
        force3D: true,
      }, 0);
    } else {
      tl.to(lines[0], {
        y: -4,
        rotation: 0,
        x: 0,
        opacity: 1,
        duration: 0.35 * animationSpeed,
        ease: "power2.out",
        force3D: true,
      }, 0).to(lines[1], {
        y: 4,
        rotation: 0,
        x: 0,
        opacity: 1,
        duration: 0.35 * animationSpeed,
        ease: "power2.out",
        force3D: true,
      }, 0);
    }
    tl.eventCallback("onComplete", () => {
      if (hoverTimelineRef.current === tl) hoverTimelineRef.current = null;
    });
  }, [animationSpeed, isOpen, getLines, killLineAnimation]);

  // Clean up all running GSAP timelines on unmount
  useEffect(() => {
    const menuItems = menuItemRefs.current;
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      hoverTimelineRef.current?.kill();
      const lines = getLines();
      if (lines) {
        gsap.killTweensOf(lines);
      }
      menuItems.forEach((item) => {
        if (!item) return;
        item.style.transition = "none";
      });
      menuItemTargetsRef.current = [];
    };
  }, [getLines]);

  const closeMenu = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    activeMenuItemRef.current = null;
    setNavBackgroundPaused(false);
    setIsOpen(false);
  }, [setNavBackgroundPaused]);

  // Keyboard navigation event handler (a11y)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeMenu]);

  useEffect(() => {
    if (isOpen) {
      const previousHtmlOverflow = document.documentElement.style.overflow;
      const previousBodyOverflow = document.body.style.overflow;
      wasOpenRef.current = true;
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";

      return () => {
        document.documentElement.style.overflow = previousHtmlOverflow;
        document.body.style.overflow = previousBodyOverflow;
      };
    }

    setNavBackgroundPaused(false);
    resetMenuItemHover();
    if (wasOpenRef.current) buttonRef.current?.focus();
  }, [isOpen, resetMenuItemHover, setNavBackgroundPaused]);

  const toggleMenu = useCallback(() => {
    if (isOpen) {
      closeMenu();
      return;
    }
    setIsOpen(true);
  }, [closeMenu, isOpen]);

  const animationVariants = useMemo(() => ({
    menu: {
      initial: { y: "-100%" },
      animate: { y: "0%", transition: { duration: 0.95 * animationSpeed, ease: [0.76, 0, 0.24, 1] as const } },
      exit: { y: "-100%", transition: { duration: 0.8 * animationSpeed, ease: [0.76, 0, 0.24, 1] as const } },
    },
    navLinks: {
      initial: {},
      animate: { transition: { staggerChildren: 0.08 * animationSpeed, delayChildren: 0.5 * animationSpeed } },
      exit: { transition: { staggerChildren: 0.05 * animationSpeed, staggerDirection: -1 } },
    },
    link: {
      initial: { y: 60, opacity: 0 },
      animate: { y: 0, opacity: 1, transition: { duration: 0.6 * animationSpeed, ease: [0.215, 0.61, 0.355, 1] as const } },
      exit: { y: 30, opacity: 0, transition: { duration: 0.4 * animationSpeed, ease: [0.215, 0.61, 0.355, 1] as const } },
    },
    footer: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0, transition: { delay: 0.75 * animationSpeed, duration: 0.5 * animationSpeed, ease: "easeOut" as const } },
      exit: { opacity: 0, y: 10, transition: { duration: 0.35 * animationSpeed, ease: "easeIn" as const } },
    },
  }), [animationSpeed]);

  if (pathname === "/banner") return null;

  return (
    <>
      {/* Sleek Floating Header Bar */}
      <header className="fixed top-0 left-0 z-[100] isolate h-24 w-full overflow-hidden px-7 md:h-32 md:px-12 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-4 sm:gap-6 pointer-events-auto mix-blend-difference">
          {/* Logo X */}
          <Link
            href="/"
            aria-label="Home"
            className="group flex items-center justify-center text-white hover:opacity-85 transition-opacity"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-white"
              viewBox="0 0 895 1000"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 0H335.426L559.574 400.568L895 1000H559.574L335.426 599.432L0 0Z" />
              <path fillRule="evenodd" clipRule="evenodd" d="M335.426 1000H0L335.426 599.432V1000Z" />
              <path fillRule="evenodd" clipRule="evenodd" d="M559.574 0H895L559.574 400.568V0Z" />
            </svg>
          </Link>

          {/* Vertical Divider */}
          <div className="h-6 sm:h-7 w-[1px] bg-white/40" />

          {/* Menu Button */}
          <button
            ref={buttonRef}
            type="button"
            onClick={toggleMenu}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative z-10 group flex items-center gap-2.5 justify-center text-white hover:opacity-85 transition-opacity outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 select-none [-webkit-tap-highlight-color:transparent]"
            aria-label={isOpen ? "Close Menu" : "Open Menu"}
            aria-expanded={isOpen}
            aria-controls="site-navigation"
          >
            <div className="relative w-6 h-6 flex items-center justify-center overflow-hidden">
              <span ref={line1Ref} className="absolute w-4 h-[0.5px] bg-white" style={{ transform: "translateY(-4px)" }}></span>
              <span ref={line2Ref} className="absolute w-4 h-[0.5px] bg-white" style={{ transform: "translateY(4px)" }}></span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold font-sans h-4 flex items-center overflow-hidden relative select-none px-1.5 -mx-1.5">
              <AnimatePresence mode="wait">
                <motion.span
                  key={isOpen ? "close" : "menu"}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.22 * animationSpeed, ease: "easeOut" }}
                  className="block uppercase"
                >
                  {isOpen ? "CLOSE" : "MENU"}
                </motion.span>
              </AnimatePresence>
            </span>
          </button>
        </div>

        <Link
          href="/#register"
          className="pointer-events-auto relative z-10 group/btn font-sans text-xs md:text-sm font-normal tracking-tight text-white hover:opacity-85 transition-opacity flex items-center gap-1.5 mix-blend-difference"
        >
          <span>Problem Statement</span>
          <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
        </Link>
      </header>

      {/* Fullscreen Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={animationVariants.menu}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
              backgroundColor: "#08010F",
            }}
            className="fixed inset-0 z-[90] flex h-screen-stable w-screen flex-col justify-between overflow-hidden px-6 py-8 select-none md:px-12 md:py-12"
            id="site-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            data-lenis-prevent
            onAnimationComplete={() => {
              if (isOpenRef.current) {
                setNavBackgroundPaused(true);
              }
            }}
          >
            <CircularNebulaShader active={isOpen} animate={!prefersReducedMotion} />

            {/* Overlay Spacer to maintain layout alignment */}
            <div className="relative z-10 flex justify-start items-center w-full h-6 pointer-events-none" />

            {/* Menu Items Centered */}
            <div className="relative z-10 flex-grow flex items-center justify-center">
              <motion.nav
                variants={animationVariants.navLinks}
                className="flex flex-col items-center justify-center gap-2 text-center"
                onMouseLeave={resetMenuItemHover}
              >
                {MENU_ITEMS.map((item, idx) => {
                  return (
                    <div key={item.href} className="py-1 px-4 overflow-visible">
                      <motion.div variants={animationVariants.link}>
                        <div
                          ref={(node) => setMenuItemRef(node, idx)}
                          className="origin-center"
                        >
                          <Link
                            href={item.href}
                            onClick={() => {
                              if (item.href.includes("#")) {
                                closeMenu();
                              }
                            }}
                            onMouseEnter={() => handleMenuItemHover(idx)}
                            aria-current={pathname === item.href ? "page" : undefined}
                            className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-normal text-[#F9F6F0] font-sans cursor-pointer select-none"
                          >
                            {item.label}
                          </Link>
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </motion.nav>
            </div>

            {/* Contact Info at bottom */}
            <motion.div
              variants={animationVariants.footer}
              className="relative z-10 flex flex-col items-center justify-center text-center mt-auto"
            >
              <span className="font-serif italic text-xs md:text-sm text-[#F9F6F0]/80 mb-1">
                Contact us
              </span>
              <a
                href="mailto:hackxmuj@gmail.com"
                className="text-[#F9F6F0] text-xs md:text-sm font-sans tracking-wide hover:opacity-75 transition-opacity border-b border-[#F9F6F0] pb-0.5"
              >
                hackxmuj@gmail.com
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export { default as NavbarFadeOverlay } from "./NavbarFadeOverlay";

