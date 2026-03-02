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
      <div className="mac-menubar-brand">Aero-Controllers</div>
      <div className="mac-menubar-clock">{clock}</div>
    </div>
  );
}
