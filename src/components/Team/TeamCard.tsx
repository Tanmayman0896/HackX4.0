"use client";

import React, { useState } from "react";
import { TeamMember } from "@/data/team";

export type { SocialLinks, TeamMember } from "@/data/team";

interface TeamCardProps {
  member: TeamMember;
  index?: number;
}

export const TeamCard: React.FC<TeamCardProps> = React.memo(({ member, index = 0 }) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (name: string) => {
    if (member.initials) return member.initials;
    const clean = name.replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.|Prof\.)\s+/i, "");
    return clean
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const socials = member.socials || {};
  const emailAddr = member.email || socials.email;
  const hasEmail = Boolean(emailAddr && emailAddr.trim() !== "");
  const hasInstagram = Boolean(socials.instagram && socials.instagram.trim() !== "");
  const hasLinkedin = Boolean(socials.linkedin && socials.linkedin.trim() !== "");
  const hasGithub = Boolean(socials.github && socials.github.trim() !== "");
  const hasWebsite = Boolean(socials.website && socials.website.trim() !== "");

  const hasValidImage = Boolean(member.image && member.image.trim() !== "");

  return (
    <div className="group relative w-full max-w-[260px] sm:max-w-none aspect-[3/4] overflow-hidden rounded-[2px] bg-zinc-900/90 shadow-lg mx-auto">
      {/* Background Image / Gradient Fallback */}
      {hasValidImage && !imageError ? (
        <img
          src={member.image}
          alt={member.name}
          onError={() => setImageError(true)}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, #181824 0%, #2a1f3d 40%, #1e102a 100%)`,
          }}
        >
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center">
            <span className="text-white/90 font-bold text-2xl md:text-3xl tracking-wider select-none">
              {getInitials(member.name)}
            </span>
          </div>
        </div>
      )}

      {/* Top Gradient Overlay (for icon contrast) */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/40 to-transparent pointer-events-none z-10" />

      {/* Bottom Gradient Overlay (for text contrast) */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10" />

      {/* Top-Right Social Media & Contact Buttons (rendered on hover) */}
      {(hasEmail || hasInstagram || hasLinkedin || hasGithub || hasWebsite) && (
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {hasInstagram && (
            <a
              href={socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name}'s Instagram`}
              className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/25 backdrop-blur-md border border-white/35 text-white flex items-center justify-center shadow-md hover:bg-white/40 transition-colors"
            >
              <i className="fa-brands fa-instagram text-base md:text-lg" />
            </a>
          )}

          {hasEmail && (
            <a
              href={`mailto:${emailAddr}`}
              aria-label={`Email ${member.name}`}
              className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/25 backdrop-blur-md border border-white/35 text-white flex items-center justify-center shadow-md hover:bg-white/40 transition-colors"
            >
              <i className="fa-solid fa-envelope text-sm md:text-base" />
            </a>
          )}

          {hasLinkedin && (
            <a
              href={socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name}'s LinkedIn`}
              className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/25 backdrop-blur-md border border-white/35 text-white flex items-center justify-center shadow-md hover:bg-white/40 transition-colors"
            >
              <i className="fa-brands fa-linkedin-in text-base md:text-lg" />
            </a>
          )}

          {hasGithub && (
            <a
              href={socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name}'s GitHub`}
              className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/25 backdrop-blur-md border border-white/35 text-white flex items-center justify-center shadow-md hover:bg-white/40 transition-colors"
            >
              <i className="fa-brands fa-github text-base md:text-lg" />
            </a>
          )}

          {hasWebsite && (
            <a
              href={socials.website}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name}'s Portfolio`}
              className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/25 backdrop-blur-md border border-white/35 text-white flex items-center justify-center shadow-md hover:bg-white/40 transition-colors"
            >
              <i className="fa-solid fa-globe text-sm md:text-base" />
            </a>
          )}
        </div>
      )}

      {/* Bottom-Left Details */}
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-5 z-20 text-left flex flex-col justify-end">
        <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-white tracking-wide font-sans leading-tight drop-shadow-md">
          {member.name}
        </h3>
        <p className="text-[11px] sm:text-xs md:text-sm text-gray-300/90 font-normal tracking-wide mt-0.5 drop-shadow-sm">
          {member.role}
        </p>
      </div>
    </div>
  );
});

TeamCard.displayName = "TeamCard";
