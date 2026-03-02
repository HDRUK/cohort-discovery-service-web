"use client";

import React, { createContext, useCallback, useContext, useRef } from "react";

type CloseGuard = () => Promise<boolean> | boolean;

type CloseGuardApi = {
  registerCloseGuard: (fn: CloseGuard | null) => void;
  confirmCloseIfNeeded: () => Promise<boolean>;
};

const CloseGuardContext = createContext<CloseGuardApi | null>(null);

export function CloseGuardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const guardRef = useRef<CloseGuard | null>(null);

  const registerCloseGuard = useCallback((fn: CloseGuard | null) => {
    guardRef.current = fn;
  }, []);

  const confirmCloseIfNeeded = useCallback(async () => {
    if (!guardRef.current) return true;
    const result = guardRef.current();
    return await result;
  }, []);

  return (
    <CloseGuardContext.Provider
      value={{ registerCloseGuard, confirmCloseIfNeeded }}
    >
      {children}
    </CloseGuardContext.Provider>
  );
}

export function useCloseGuard() {
  const ctx = useContext(CloseGuardContext);
  if (!ctx)
    throw new Error("useCloseGuard must be used within CloseGuardProvider");
  return ctx;
}
