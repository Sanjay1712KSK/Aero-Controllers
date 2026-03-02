"use client";

import Image from "next/image";

const members = [
  {
    name: "Sanjay Kumar S",
    role: "3rd Year CSE - AIML",
    institution: "SRM Institute of Science and Technology",
    links: [
      { label: "GitHub", href: "https://github.com/Sanjay1712KSK" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/sanjaykumarksk/" },
      { label: "Gmail", href: "mailto:sanjayksk1712@gmail.com" },
      { label: "Instagram", href: "https://www.instagram.com/ummnothingheree/?hl=en" },
    ],
  },
  {
    name: "Sanjay Siva S",
    role: "3rd Year CSE - AIML",
    institution: "SRM Institute of Science and Technology",
    links: [
      { label: "GitHub", href: "https://github.com/Sanjay-2437" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/sanjay-siva-250a64288/" },
      { label: "Gmail", href: "mailto:sanjaysiva2405@gmail.com" },
    ],
  },
  {
    name: "Jahanvi",
    role: "2nd Year CSE (Core)",
    institution: "SRM Institute of Science and Technology",
    links: [
      { label: "GitHub", href: "https://github.com/Jahanvisaini3135" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/jahanvi3135/" },
    ],
  },
];

function initials(name) {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

function SocialIcon({ label }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  if (label === "GitHub") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          {...common}
          d="M9 19c-4 1.3-4-2.2-6-2.5m12 5v-3.2a2.8 2.8 0 0 0-.8-2.2c2.6-.3 5.3-1.2 5.3-5.5a4.2 4.2 0 0 0-1.1-2.9 3.8 3.8 0 0 0-.1-2.9s-1-.3-3.2 1.1a11 11 0 0 0-5.8 0C7 4.5 6 4.8 6 4.8a3.8 3.8 0 0 0-.1 2.9A4.2 4.2 0 0 0 4.8 10.6c0 4.3 2.7 5.2 5.3 5.5a2.8 2.8 0 0 0-.8 2.2v3.2"
        />
      </svg>
    );
  }

  if (label === "LinkedIn") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect {...common} x="4" y="4" width="16" height="16" rx="3" />
        <path {...common} d="M8 11v5M8 8.5v.1M12 16v-3a2 2 0 0 1 4 0v3" />
      </svg>
    );
  }

  if (label === "Gmail") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect {...common} x="3" y="5" width="18" height="14" rx="2.5" />
        <path {...common} d="M4 7l8 6 8-6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect {...common} x="5" y="5" width="14" height="14" rx="4" />
      <circle {...common} cx="12" cy="12" r="3.2" />
      <circle cx="16.6" cy="7.5" r="1" fill="currentColor" />
    </svg>
  );
}

function ProfileCard({ member, index }) {
  return (
    <article className="card team-card">
      <div className="avatar">{initials(member.name)}</div>
      <h2>{member.name}</h2>
      <p className="role">{member.role}</p>
      <p className="institution">{member.institution}</p>

      <div className="card-divider" aria-hidden="true" />
      <div className="links">
        {member.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            aria-label={link.label}
            title={link.label}
            target={link.href.startsWith("mailto:") ? undefined : "_blank"}
            rel={link.href.startsWith("mailto:") ? undefined : "noreferrer"}
            className="icon-btn"
          >
            <SocialIcon label={link.label} />
          </a>
        ))}
      </div>
    </article>
  );
}

export default function AboutUsPage() {
  return (
    <main className="page about-page">
      <section className="hero-section" aria-label="Hero">
        <div className="hero-content">
          <div className="logo-shell">
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? "/Aero-Controllers"}/AeroControllers.png`}
              alt="Aero-Controllers logo"
              width={200}
              height={200}
              className="team-logo"
              priority
            />
          </div>
          <h1>Team Aero-Controllers</h1>
          <p className="subtitle hero-subtitle">
            Autonomous Drone Stabilization
            <br />
            &amp; Control Systems
          </p>
        </div>
      </section>

      <section className="statement-section" aria-label="Cinematic statement">
        <div className="statement-content">
          <p className="line-1">In GPS-denied skies, stability is not inherited.</p>
          <p className="line-2">It is learned.</p>
        </div>
      </section>

      <section className="team-section" aria-label="Team reveal">
        <div className="team-container">
          <div className="grid">
            {members.map((member, index) => (
              <ProfileCard key={member.name} member={member} index={index} />
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">Aero-Controllers</footer>

      <style jsx>{`
        .page {
          min-height: 100vh;
          padding: max(24px, env(safe-area-inset-top)) clamp(20px, 3vw, 42px)
            max(28px, env(safe-area-inset-bottom));
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif;
          color: rgba(255, 255, 255, 0.94);
          background: var(--app-bg-grade);
        }

        .hero-section {
          min-height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          animation: heroReveal 1.1s cubic-bezier(.22,.61,.36,1) forwards;
          opacity: 0;
          transform: translateY(-40px);
        }

        .hero-content {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
        }

        .logo-shell {
          position: relative;
          width: fit-content;
          margin: 0 auto;
        }

        .logo-shell::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          width: 160px;
          height: 160px;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%);
          z-index: -1;
          pointer-events: none;
        }

        .team-logo {
          width: 120px;
          max-width: 120px;
          height: auto;
          display: block;
          margin: 0 auto 30px;
          opacity: 0.85;
          filter: drop-shadow(0 10px 40px rgba(0,0,0,0.4));
          animation: logoFade 1.2s ease forwards;
        }

        .hero-content h1 {
          margin: 0 0 14px;
          font-size: clamp(2.5rem, 5.4vw, 4.4rem);
          line-height: 1.06;
          letter-spacing: -0.02em;
          font-weight: 650;
          color: rgba(255, 255, 255, 0.98);
        }

        .subtitle {
          margin: 0;
          font-size: clamp(1.02rem, 1.9vw, 1.22rem);
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.72);
        }

        .hero-subtitle {
          opacity: 0;
          animation: subtitleReveal 1s ease forwards;
          animation-delay: 0.4s;
        }

        .statement-section {
          min-height: 50vh;
          margin-top: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .statement-content {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
        }

        .line-1 {
          margin: 0 0 12px;
          font-size: clamp(1.75rem, 4.1vw, 2.4rem);
          font-weight: 500;
          line-height: 1.28;
          letter-spacing: -0.015em;
          color: rgba(255, 255, 255, 0.92);
        }

        .line-2 {
          margin: 0;
          font-size: clamp(1.45rem, 3.2vw, 2rem);
          font-weight: 500;
          line-height: 1.3;
          color: rgba(255, 255, 255, 0.7);
        }

        .team-section {
          margin-top: 120px;
        }

        .team-container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
        }

        .footer {
          margin-top: 120px;
          text-align: center;
          font-size: 0.76rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.46);
          padding-bottom: 16px;
        }

        @media (max-width: 1050px) {
          .grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 760px) {
          .statement-section {
            margin-top: 56px;
          }

          .team-section {
            margin-top: 80px;
          }

          .grid {
            grid-template-columns: 1fr;
            gap: 22px;
          }

          .footer {
            margin-top: 80px;
          }
        }
      `}</style>
      <style jsx global>{`
        .about-page .card {
          padding: 28px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: transform 220ms ease, background 220ms ease, border-color 220ms ease;
        }

        .about-page .team-card {
          opacity: 0;
          transform: translateY(40px);
          animation: cardRise 0.8s ease forwards;
        }

        .about-page .team-card:nth-child(1) { animation-delay: 0.2s; }
        .about-page .team-card:nth-child(2) { animation-delay: 0.35s; }
        .about-page .team-card:nth-child(3) { animation-delay: 0.5s; }

        .about-page .card:hover {
          transform: translateY(-6px);
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .about-page .avatar {
          width: 85px;
          height: 85px;
          margin: 0 auto 18px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.03));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.05rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.95);
        }

        .about-page .card h2 {
          margin: 0 0 8px;
          font-size: 1.24rem;
          line-height: 1.2;
          color: rgba(255, 255, 255, 0.95);
        }

        .about-page .role {
          margin: 0 0 4px;
          font-size: 0.92rem;
          color: rgba(255, 255, 255, 0.72);
        }

        .about-page .institution {
          margin: 0 0 14px;
          font-size: 0.84rem;
          line-height: 1.45;
          color: rgba(255, 255, 255, 0.56);
        }

        .about-page .card-divider {
          width: 100%;
          height: 1px;
          margin: 0 0 12px;
          background: rgba(255, 255, 255, 0.1);
        }

        .about-page .links {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          width: 100%;
        }

        .about-page .icon-btn {
          width: 22px;
          height: 22px;
          min-width: 22px;
          min-height: 22px;
          max-width: 22px;
          max-height: 22px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.72);
          text-decoration: none;
          overflow: hidden;
          line-height: 0;
          transition: transform 180ms ease, color 180ms ease;
        }

        .about-page .icon-btn:hover {
          color: rgba(255, 255, 255, 0.98);
          transform: scale(1.08);
        }

        .about-page .icon-btn svg {
          width: 22px !important;
          height: 22px !important;
          min-width: 22px !important;
          min-height: 22px !important;
          max-width: 22px !important;
          max-height: 22px !important;
          flex: 0 0 22px;
          display: block;
        }
      `}</style>
      <style jsx>{`
        @keyframes heroReveal {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes subtitleReveal {
          to {
            opacity: 1;
          }
        }

        @keyframes logoFade {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 0.85;
            transform: scale(1);
          }
        }
      `}</style>
      <style jsx global>{`
        @keyframes cardRise {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
