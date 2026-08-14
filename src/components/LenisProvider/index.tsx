"use client";

import React, { useEffect, useRef } from "react";
import { ReactLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Normalize mobile touch scroll behavior so Chrome address bar stays static on mobile globally
    const mm = gsap.matchMedia();
    mm.add("(max-width: 767px)", () => {
      ScrollTrigger.normalizeScroll({ allowNestedScroll: true, lockAxis: false });
      return () => {
        ScrollTrigger.normalizeScroll(false);
      };
    });

    const lenis = lenisRef.current?.lenis;
    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
    }

    // Sync Lenis scroll updates with the GSAP ticker
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    // Keep GSAP's default lag smoothing so expensive frames (WebGL backgrounds)
    // don't cause the scroll interpolation to stutter/jump.
    gsap.ticker.lagSmoothing(500, 33);
    gsap.ticker.add(update);

    // Refresh ScrollTrigger to ensure accurate positions after Lenis initializes
    ScrollTrigger.refresh();

    return () => {
      if (lenis) {
        lenis.off("scroll", ScrollTrigger.update);
      }
      gsap.ticker.remove(update);
      mm.revert();
      ScrollTrigger.normalizeScroll(false);
    };
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      autoRaf={false}
      options={{
        // Slightly shorter interpolation keeps navigation responsive to the
        // user's wheel/trackpad input while staying smooth.
        duration: 0.6,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        touchMultiplier: 0,
        wheelMultiplier: 1,
      }}
    >
      {children}
    </ReactLenis>
  );
}
