"use client";

import { useEffect } from "react";
import { msUntilSessionEnds } from "@/lib/sessionRedirect";
import { useSessionStore } from "@/store/sessionStore";

const MAX_TIMEOUT_MS = 2 ** 31 - 1;

const useSessionExpiry = (exp: number | undefined): void => {
  const endSession = useSessionStore((s) => s.endSession);

  useEffect(() => {
    const delay = msUntilSessionEnds(exp, Date.now());
    if (delay === null) return;

    const timer =
      delay <= MAX_TIMEOUT_MS ? setTimeout(endSession, delay) : undefined;

    const endIfExpired = () => {
      if (
        document.visibilityState === "visible" &&
        msUntilSessionEnds(exp, Date.now()) === 0
      ) {
        endSession();
      }
    };
    document.addEventListener("visibilitychange", endIfExpired);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", endIfExpired);
    };
  }, [exp, endSession]);
};

export default useSessionExpiry;
