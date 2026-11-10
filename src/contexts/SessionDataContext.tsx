"use client";

import { createContext, ReactNode, useContext } from "react";
import { Collection, CombinedUser, Custodian, Workgroup } from "@/types/api";

export interface SessionData {
  user: CombinedUser;
  userCollections: Collection[];
  custodians: Custodian[];
  workgroups: Workgroup[];
}

const SessionDataContext = createContext<SessionData | null>(null);

export const SessionDataProvider = ({
  value,
  children,
}: {
  value: SessionData;
  children: ReactNode;
}) => (
  <SessionDataContext.Provider value={value}>
    {children}
  </SessionDataContext.Provider>
);

export const useSessionData = (): SessionData => {
  const sessionData = useContext(SessionDataContext);
  if (!sessionData)
    throw new Error(
      "useSessionData must be used within <SessionDataProvider />",
    );
  return sessionData;
};

export const useSessionUser = (): CombinedUser | null =>
  useContext(SessionDataContext)?.user ?? null;
