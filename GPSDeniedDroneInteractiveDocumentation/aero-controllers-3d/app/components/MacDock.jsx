"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const APPS = [
  { id: "story", label: "STORY", path: "/", Icon: IconStory },
  { id: "technical", label: "Control & Stability Framework", path: "/technical", Icon: IconControl },
  { id: "architecture", label: "System Architecture", path: "/architecture", Icon: IconArchitecture },
  { id: "simulation", label: "Simulation", path: "/simulation", Icon: IconSimulation },
  { id: "docs", label: "DOCUMENTATION", path: "/documentation", Icon: IconDocs },
  { id: "guide", label: "HOW TO USE", path: "/how-to-use", Icon: IconGuide },
  { id: "about", label: "ABOUT US", path: "/about-us", Icon: IconAbout },
  { id: "github", label: "GITHUB", href: "https://github.com/Sanjay1712KSK/Aero-Controllers", Icon: IconGithub },
];

function IconStory() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M8 9h8M8 12h6M8 15h5" />
    </svg>
  );
}

function IconControl() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12h3l2-5 4 10 2-5h7" />
    </svg>
  );
}

function IconGuide() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9.25" />
      <path d="M9.5 9.2a2.5 2.5 0 1 1 3.6 2.25c-.82.4-1.3.97-1.3 1.8v.35" />
      <circle cx="12" cy="16.8" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconDocs() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z" />
      <path d="M14 3.5V8h4" />
      <path d="M9 12h6M9 15h6M9 18h4" />
    </svg>
  );
}

function IconAbout() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="3.25" />
      <path d="M5 19.5c1.4-3 4-4.5 7-4.5s5.6 1.5 7 4.5" />
    </svg>
  );
}

function IconArchitecture() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="2.5" width="6" height="4" rx="1" />
      <rect x="2.5" y="10" width="5" height="4" rx="1" />
      <rect x="16.5" y="10" width="5" height="4" rx="1" />
      <rect x="9" y="17.5" width="6" height="4" rx="1" />
      <path d="M12 6.5V10M7.5 12h1.5M15 12h1.5M7 14l2.5 3.5M17 14l-2.5 3.5" />
    </svg>
  );
}

function IconSimulation() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9.25" />
      <path d="M10 8.5L16 12l-6 3.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconGithub() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 19c-4 1.3-4-2.2-6-2.5m12 5v-3.2a2.8 2.8 0 0 0-.8-2.2c2.6-.3 5.3-1.2 5.3-5.5a4.2 4.2 0 0 0-1.1-2.9 3.8 3.8 0 0 0-.1-2.9s-1-.3-3.2 1.1a11 11 0 0 0-5.8 0C7 4.5 6 4.8 6 4.8a3.8 3.8 0 0 0-.1 2.9A4.2 4.2 0 0 0 4.8 10.6c0 4.3 2.7 5.2 5.3 5.5a2.8 2.8 0 0 0-.8 2.2v3.2" />
    </svg>
  );
}

export default function MacDock({ activePath }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(null);
  const [bouncing, setBouncing] = useState(null);

  const getScale = (idx) => {
    if (hovered === null) return 1;
    const d = Math.abs(idx - hovered);
    if (d === 0) return 1.2;
    if (d === 1) return 1.1;
    return 1;
  };

  const getLift = (idx) => {
    if (hovered === null) return 0;
    const d = Math.abs(idx - hovered);
    if (d === 0) return -8;
    if (d === 1) return -4;
    return 0;
  };

  return (
    <div className="mac-dock" role="toolbar" aria-label="Dock">
      {APPS.map((app, idx) => {
        const isExternal = Boolean(app.href);
        const isActive = isExternal ? false : app.path === "/" ? activePath === "/" : activePath?.startsWith(app.path);
        const scale = getScale(idx);
        const lift = getLift(idx);
        const isBouncing = bouncing === app.id;
        const showLabel = hovered === idx;

        return (
          <button
            key={app.id}
            type="button"
            title={app.label}
            className={`mac-dock-item${isActive ? " is-active" : ""}${isBouncing ? " is-bouncing" : ""}`}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => {
              setBouncing(app.id);
              setTimeout(() => setBouncing(null), 380);
              if (isExternal) {
                window.open(app.href, "_blank", "noopener,noreferrer");
                return;
              }
              router.push(app.path);
            }}
          >
            {showLabel && <span className="mac-dock-label">{app.label}</span>}
            <span className="mac-dock-item-shell" style={{ transform: `translateY(${lift}px) scale(${scale})` }}>
              <span className="mac-dock-icon">
                <app.Icon />
              </span>
            </span>
            <span className="mac-dock-dot" />
          </button>
        );
      })}
    </div>
  );
}
