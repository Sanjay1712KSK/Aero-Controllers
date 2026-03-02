"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useMemo, useState } from "react";
import MacDock from "./MacDock";
import MacMenuBar from "./MacMenuBar";
import MacWindow from "./MacWindow";

const TITLES = {
  "/how-to-use": "How To Use",
  "/documentation": "Documentation",
  "/about-us": "About Us",
  "/technical": "Control & Stability Framework",
  "/architecture": "System Architecture",
  "/simulation": "Simulation - Phase 1",
  "/simulation/phase-2": "Simulation - Phase 2",
  "/simulation/phase-3": "Simulation - Phase 3",
};

export default function MacDesktopProvider({ children }) {
  const pathname = usePathname();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isDesktop = pathname === "/";

  const title = useMemo(() => TITLES[pathname] ?? "Aero-Controllers", [pathname]);

  useLayoutEffect(() => {
    setIsFullscreen(false);
  }, [pathname]);

  return (
    <div className="mac-shell">
      <div className="mac-wallpaper" aria-hidden="true" />
      {!isFullscreen && <MacMenuBar />}

      {isDesktop ? (
        <div className="mac-desktop-content">{children}</div>
      ) : (
        <MacWindow
          title={title}
          isFullscreen={isFullscreen}
          onFullscreenChange={setIsFullscreen}
        >
          {children}
        </MacWindow>
      )}

      {!isFullscreen && <MacDock activePath={pathname} />}

      <div className="mac-credit">Made by Team Aero-Controllers</div>
    </div>
  );
}
