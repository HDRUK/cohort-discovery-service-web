"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const TO_AUTH_GEOMETRY_MS = 200;
const TO_AUTH_CONTENT_MS = 900;
const TO_LANDING_GEOMETRY_MS = 280;
const TO_LANDING_CONTENT_MS = 1000;
const SETTLE_MS = 1400;

export interface LoginStage {
  showLanding: boolean;
  isAuth: boolean;
  showForm: boolean;
  busy: boolean;
  toAuth: () => void;
  toLanding: () => void;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const useLoginStage = (): LoginStage => {
  const [showLanding, setShowLanding] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const schedule = useCallback((delay: number, run: () => void) => {
    timers.current.push(setTimeout(run, delay));
  }, []);

  const toAuth = useCallback(() => {
    if (busy) return;

    if (prefersReducedMotion()) {
      setShowLanding(false);
      setIsAuth(true);
      setShowForm(true);
      return;
    }

    setBusy(true);
    setShowLanding(false);
    schedule(TO_AUTH_GEOMETRY_MS, () => setIsAuth(true));
    schedule(TO_AUTH_CONTENT_MS, () => setShowForm(true));
    schedule(SETTLE_MS, () => setBusy(false));
  }, [busy, schedule]);

  const toLanding = useCallback(() => {
    if (busy) return;

    if (prefersReducedMotion()) {
      setShowForm(false);
      setIsAuth(false);
      setShowLanding(true);
      return;
    }

    setBusy(true);
    setShowForm(false);
    schedule(TO_LANDING_GEOMETRY_MS, () => setIsAuth(false));
    schedule(TO_LANDING_CONTENT_MS, () => setShowLanding(true));
    schedule(SETTLE_MS, () => setBusy(false));
  }, [busy, schedule]);

  return { showLanding, isAuth, showForm, busy, toAuth, toLanding };
};

export default useLoginStage;
