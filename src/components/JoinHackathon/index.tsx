"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface JoinHackathonProps {
  title?: string;
  highlightText?: string;
  href?: string;
  buttonText?: string;
}

const CARD_STYLE: React.CSSProperties = {
  background:
    "linear-gradient(115deg, color-mix(in srgb, var(--bg-gradient-from) 72%, #020207), color-mix(in srgb, var(--bg-gradient-via) 68%, #020207) 56%, color-mix(in srgb, var(--bg-gradient-to) 72%, #020207))",
  border: "1px solid color-mix(in srgb, var(--bg-gradient-from) 38%, white)",
  borderBottom: "0",
  transition: "background 500ms ease, border-color 500ms ease",
};

const HIGHLIGHT_TEXT_STYLE: React.CSSProperties = {
  color: "color-mix(in srgb, var(--bg-gradient-from) 30%, white)",
};

const BUTTON_STYLE: React.CSSProperties = {
  backgroundColor: "color-mix(in srgb, var(--bg-gradient-from) 16%, white)",
  borderColor: "color-mix(in srgb, var(--bg-gradient-from) 12%, white)",
  transition: "background-color 500ms ease, border-color 500ms ease, transform 300ms ease",
};

export default function JoinHackathon({
  title = "Join the",
  highlightText = "Hackathon!",
  href = "https://hackxmuj.com/register",
  buttonText = "Register now",
}: JoinHackathonProps) {
  return (
    <section
      id="register"
      className="relative w-full overflow-hidden px-4 pt-2 pb-0 sm:px-8 md:px-16 md:pt-2 md:pb-0 -mb-8 md:-mb-14"
      aria-labelledby="join-hackathon-title"
    >
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, scale: 1.01 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto max-w-3xl overflow-hidden rounded-[2.5rem] transform-gpu will-change-transform"
        style={CARD_STYLE}
      >
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        <Image
          src="/assets/backgrounds/join-x.svg"
          alt=""
          aria-hidden="true"
          width={258}
          height={284}
          unoptimized
          decoding="async"
          className="pointer-events-none absolute right-5 top-1/2 h-28 w-auto -translate-y-1/2 opacity-25 sm:right-8 sm:h-36 md:right-10 md:h-40"
        />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/55 to-transparent pointer-events-none" />

        <div className="relative flex min-h-[8.5rem] flex-col gap-5 px-6 py-6 sm:px-8 sm:py-7 md:min-h-[9.5rem] md:flex-row md:items-center md:justify-between md:px-10 md:py-8">
          <div className="max-w-2xl">
            <h2
              id="join-hackathon-title"
              className="[font-family:var(--font-montserrat)] text-3xl font-black uppercase leading-[0.92] tracking-[-0.04em] text-[#faf8f5] sm:text-4xl md:text-5xl"
            >
              {title} <span style={HIGHLIGHT_TEXT_STYLE}>{highlightText}</span>
            </h2>
          </div>

          <a
            href={href}
            className="group relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border px-5 py-3 font-sans text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#10051f] hover:-translate-y-1 hover:border-white hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:px-6"
            style={BUTTON_STYLE}
            aria-label={`${buttonText} - ${title} ${highlightText}`}
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/80 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative">{buttonText}</span>
            <svg
              className="relative ml-3 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path d="M2 8h11M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </motion.div>
    </section>
  );
}

