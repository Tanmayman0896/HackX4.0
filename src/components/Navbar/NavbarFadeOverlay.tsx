"use client";

import React from "react";
import { usePathname } from "next/navigation";

export interface NavbarFadeOverlayProps {
  /**
   * The height of the fade overlay in pixels for desktop viewports.
   * If provided, overrides responsive height scaling.
   * @default 150
   */
  height?: number;

  /**
   * Subtle backdrop blur radius in pixels.
   * Clamped to max 12px for optimal GPU rendering and crisp readability.
   * @default 10
   */
  blur?: number;

  /**
   * Overall opacity scale of the overlay (0 to 1).
   * @default 1
   */
  opacity?: number;

  /**
   * Base color of the top edge fade.
   * Should match the dark background tone of your hero section.
   * @default "#05000d"
   */
  bgColor?: string;

  /**
   * Optional custom CSS or Tailwind class names.
   */
  className?: string;
}

/**
 * NavbarFadeOverlay
 * 
 * Production-ready top fade overlay component inspired by Vercel, Apple, and Linear.
 * Fixed to top of viewport (`z-[80]`), sitting between top navigation (`z-[100]`) 
 * and scrolling page content (`z-10`).
 * 
 * Performance & Architecture:
 * - 100% CSS-driven (zero scroll event listeners, zero JS execution overhead)
 * - Masked backdrop-filter blur (prevents hard blur edges)
 * - Non-linear multi-stop scrim gradient (prevents harsh gradient banding/lines)
 * - Ultra-subtle dithering noise (eliminates color banding on OLED displays)
 * - Lenis & Mobile Safari smooth-scroll compatible
 */
export const NavbarFadeOverlay: React.FC<NavbarFadeOverlayProps> = ({
  height = 150,
  blur = 10,
  opacity = 1,
  bgColor = "#05000d",
  className = "",
}) => {
  // Enforce max 12px blur constraint to prevent GPU frame drops & over-blurring
  const safeBlur = Math.min(Math.max(blur, 0), 12);

  // Convert hex color to RGBA stops if standard hex is passed for universal browser support
  const hexToRgba = (hex: string, alpha: number) => {
    let cleanHex = hex.replace("#", "");
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split("").map((c) => c + c).join("");
    }
    if (cleanHex.length !== 6) return `rgba(5, 0, 13, ${alpha})`;
    const num = parseInt(cleanHex, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const isCustomHeight = height !== 150;
  const heightStyle = isCustomHeight ? { height: `${height}px` } : {};
  const pathname = usePathname();

  if (pathname === "/banner") return null;

  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`fixed top-0 left-0 right-0 w-full pointer-events-none z-[80] select-none ${
        isCustomHeight ? "" : "h-[110px] md:h-[130px] lg:h-[150px]"
      } ${className}`}
      style={{
        opacity,
        ...heightStyle,
        WebkitTransform: "translateZ(0)",
        transform: "translateZ(0)",
      }}
    >
      {/* Layer 1: Masked Backdrop Blur (Softens scrolling content beneath without hard lower boundary) */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          backdropFilter: `blur(${safeBlur}px)`,
          WebkitBackdropFilter: `blur(${safeBlur}px)`,
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* Layer 2: Eased Scrim Color Gradient (Natural non-linear fade to hero background) */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          background: `linear-gradient(
            to bottom,
            ${hexToRgba(bgColor, 1.0)} 0%,
            ${hexToRgba(bgColor, 0.95)} 20%,
            ${hexToRgba(bgColor, 0.75)} 40%,
            ${hexToRgba(bgColor, 0.45)} 65%,
            ${hexToRgba(bgColor, 0.18)} 85%,
            ${hexToRgba(bgColor, 0.0)} 100%
          )`,
        }}
      />

      {/* Layer 3: Micro Noise Texture (Prevents gradient color banding on OLED screens) */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

export default NavbarFadeOverlay;
