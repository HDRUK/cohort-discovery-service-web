"use client";

import { useEffect } from "react";
import { routes } from "@/config/routes";
import { DEFAULT_SESSION_EXPIRED_REDIRECT_DELAY_MS } from "@/config/defaults";
import { useNotify } from "@/providers/NotifyProvider";
import { useSessionStore } from "@/store/sessionStore";
import { SESSION_EXPIRED_MESSAGE } from "@/utils/queryErrors";

const SessionEndedHandler = () => {
  const hasEnded = useSessionStore((s) => s.hasEnded);
  const notify = useNotify();

  useEffect(() => {
    if (!hasEnded) return;

    notify({
      message: SESSION_EXPIRED_MESSAGE,
      severity: "error",
      autoHideDuration: null,
      anchorOrigin: { vertical: "top", horizontal: "center" },
    });
    const timer = setTimeout(
      () => window.location.assign(routes.logout),
      DEFAULT_SESSION_EXPIRED_REDIRECT_DELAY_MS,
    );
    return () => clearTimeout(timer);
  }, [hasEnded, notify]);

  return null;
};

export default SessionEndedHandler;
