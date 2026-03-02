"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function TrafficButton({ color, onClick }) {
  return (
    <button
      type="button"
      aria-label="window control"
      onClick={onClick}
      style={{
        width: 12,
        height: 12,
        borderRadius: "50%",
        border: "none",
        background: color,
        cursor: "pointer",
      }}
    />
  );
}

export default function MacWindow({ children, title, isFullscreen, onFullscreenChange }) {
  const router = useRouter();
  const pathname = usePathname();
  const frameRef = useRef(null);
  const dragRef = useRef({ active: false, offsetX: 0, offsetY: 0 });

  const [position, setPosition] = useState({ x: null, y: null });
  const [isMinimizing, setIsMinimizing] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const isSimulationRoute = pathname.startsWith("/simulation");
  const isCompact = viewport.w > 0 && viewport.w <= 900;

  useEffect(() => {
    setIsEntering(true);
    setIsMinimizing(false);
    setPosition({ x: null, y: null });
    onFullscreenChange(false);
    const timer = setTimeout(() => setIsEntering(false), 240);
    return () => clearTimeout(timer);
  }, [pathname, onFullscreenChange]);

  useEffect(() => {
    const updateViewport = () => {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    };
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    const onMove = (event) => {
      if (!dragRef.current.active || isFullscreen) return;
      setPosition({
        x: event.clientX - dragRef.current.offsetX,
        y: event.clientY - dragRef.current.offsetY,
      });
    };

    const onUp = () => {
      dragRef.current.active = false;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isFullscreen]);

  const onDragStart = (event) => {
    if (isFullscreen || isCompact) return;
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;

    dragRef.current.active = true;
    dragRef.current.offsetX = event.clientX - rect.left;
    dragRef.current.offsetY = event.clientY - rect.top;
    setPosition({ x: rect.left, y: rect.top });
  };

  const closeWindow = () => {
    router.push("/");
  };

  const minimizeWindow = () => {
    setIsMinimizing(true);
    setTimeout(() => router.push("/"), 280);
  };

  const frameStyle = isFullscreen
    ? { inset: 0, borderRadius: 0, width: "100vw", height: "100vh" }
    : {
        width: isCompact ? "calc(100vw - 10px)" : "min(94vw, 1360px)",
        height: isCompact ? "calc(100vh - 84px)" : "min(88vh, 980px)",
        left: position.x === null ? 0 : `${position.x}px`,
        right: position.x === null ? 0 : "auto",
        margin: position.x === null ? "0 auto" : 0,
        top: position.y === null ? (isCompact ? "38px" : "52px") : `${position.y}px`,
        borderRadius: isCompact ? 12 : 16,
      };

  return (
    <div
      ref={frameRef}
      className={`mac-window${isEntering ? " is-open" : ""}${isMinimizing ? " is-minimizing" : ""}${isFullscreen ? " is-fullscreen" : ""}`}
      style={frameStyle}
    >
      <div className="mac-window-titlebar" onMouseDown={onDragStart}>
        <div className="mac-traffic-lights">
          <TrafficButton color="#FF5F57" onClick={closeWindow} />
          <TrafficButton color="#FEBC2E" onClick={minimizeWindow} />
          <TrafficButton color="#28C840" onClick={() => onFullscreenChange(!isFullscreen)} />
        </div>
        <div className="mac-window-title">{title}</div>
      </div>

      {isSimulationRoute && (
        <div className="mac-window-phasebar">
          <button
            type="button"
            className={`mac-segment-btn${pathname === "/simulation" ? " is-active" : ""}`}
            onClick={() => router.push("/simulation")}
          >
            Phase 1
          </button>
          <button
            type="button"
            className={`mac-segment-btn${pathname === "/simulation/phase-2" ? " is-active" : ""}`}
            onClick={() => router.push("/simulation/phase-2")}
          >
            Phase 2
          </button>
          <button
            type="button"
            className={`mac-segment-btn${pathname === "/simulation/phase-3" ? " is-active" : ""}`}
            onClick={() => router.push("/simulation/phase-3")}
          >
            Phase 3
          </button>
          <button
            type="button"
            className={`mac-segment-btn${pathname === "/simulation/phase-4" ? " is-active" : ""}`}
            onClick={() => router.push("/simulation/phase-4")}
          >
            Phase 4
          </button>
        </div>
      )}

      <div className="mac-window-content">
        {children}
      </div>
    </div>
  );
}
