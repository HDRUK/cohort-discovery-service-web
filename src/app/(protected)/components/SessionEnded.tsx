"use client";

import { useEffect } from "react";
import { useSessionStore } from "@/store/sessionStore";

const SessionEnded = () => {
  const endSession = useSessionStore((s) => s.endSession);

  useEffect(() => {
    endSession();
  }, [endSession]);

  return null;
};

export default SessionEnded;
