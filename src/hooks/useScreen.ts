import { useState, useEffect } from "react";
import type { AppScreen } from "../types";

export function useScreen() {
  const [screen, setScreen] = useState<AppScreen>("splash");

  useEffect(() => {
    const t = setTimeout(() => {
      const hasSeen = localStorage.getItem("has_seen_onboarding");

      if (hasSeen) {
        setScreen("chat"); 
      } else {
        setScreen("onboarding"); 
      }
    }, 2200);

    return () => clearTimeout(t);
  }, []);

  return { screen, goTo: setScreen };
}
