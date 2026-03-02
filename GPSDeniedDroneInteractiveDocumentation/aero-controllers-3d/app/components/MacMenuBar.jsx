"use client";

import { useEffect, useState } from "react";

export default function MacMenuBar() {
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    };

    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mac-menubar">
      <div className="menubar-left">AERO-CONTROLLERS</div>

      <div className="menubar-center">
        <span className="menubar-title">A Live Interactive Documentation By Team Aero-Controllers</span>
      </div>

      <div className="menubar-right">{clock}</div>
    </div>
  );
}
