"use client";

import { createContext, useContext, useMemo } from "react";
import { isStandalone, isIntegrated } from "@/utils/modes";

export interface ApplicationModeContextValue {
  applicationMode?: string;
  isStandalone: boolean;
  isIntegrated: boolean;
}

const ApplicationModeContext =
  createContext<ApplicationModeContextValue | null>(null);

interface ApplicationModeProviderProps {
  children: React.ReactNode;
  applicationMode?: string;
}

export default function ApplicationModeProvider({
  children,
  applicationMode,
}: ApplicationModeProviderProps) {
  const value = useMemo(
    () => ({
      applicationMode,
      isStandalone: isStandalone(applicationMode),
      isIntegrated: isIntegrated(applicationMode),
    }),
    [applicationMode],
  );

  return (
    <ApplicationModeContext.Provider value={value}>
      {children}
    </ApplicationModeContext.Provider>
  );
}

export function useApplicationMode() {
  const context = useContext(ApplicationModeContext);

  if (!context) {
    throw new Error(
      "useApplicationMode must be used within an ApplicationModeProvider",
    );
  }

  return context;
}
