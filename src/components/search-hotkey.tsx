"use client";

import { useEffect } from "react";

export function SearchHotkey({ targetId }: { targetId: string }) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        document.getElementById(targetId)?.focus();
      }
      if (event.key === "Escape" && document.activeElement?.id === targetId) (document.activeElement as HTMLElement).blur();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [targetId]);
  return null;
}
