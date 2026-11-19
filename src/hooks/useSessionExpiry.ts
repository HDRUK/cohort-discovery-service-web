"use client";

import { useEffect } from "react";
import { useSessionStore } from "@/store/sessionStore";

const MAX_TIMEOUT_MS = 2 ** 31 - 1;

const useSessionExpiry = (msRemaining: number | null): void => {
  const endSession = useSessionStore((s) => s.endSession);

  useEffect(() => {
    if (msRemaining === null) return;

    const deadline = Date.now() + msRemaining;
    const timer =
      msRemaining <= MAX_TIMEOUT_MS
        ? setTimeout(endSession, msRemaining)
        : undefined;

    const endIfExpired = () => {
      if (document.visibilityState === "visible" && Date.now() >= deadline) {
        endSession();
      }
    };
    document.addEventListener("visibilitychange", endIfExpired);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", endIfExpired);
    };
  }, [msRemaining, endSession]);
};

export default useSessionExpiry;
