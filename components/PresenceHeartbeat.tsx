"use client";

import { useEffect } from "react";

export default function PresenceHeartbeat() {
  useEffect(() => {
    let active = true;

    async function updatePresence() {
      if (!active) return;

      try {
        await fetch("/api/presence", {
          method: "POST",
          cache: "no-store",
        });
      } catch {
        // No bloqueamos la app si falla presencia.
      }
    }

    updatePresence();

    const interval = window.setInterval(updatePresence, 30000);

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        updatePresence();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      active = false;
      window.clearInterval(interval);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  return null;
}