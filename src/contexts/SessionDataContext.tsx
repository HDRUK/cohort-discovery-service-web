"use client";

import { createContext, ReactNode, use, useContext } from "react";
import { Collection, CombinedUser, Custodian, Workgroup } from "@/types/api";

export interface SessionData {
  user: CombinedUser;
  userCollections: Collection[];
  custodians: Custodian[];
  workgroups: Workgroup[];
}

type SessionDataSource = SessionData | Promise<SessionData | null> | null;

const SessionDataContext = createContext<SessionDataSource | undefined>(
  undefined,
);

export const SessionDataProvider = ({
  value,
  children,
}: {
  value: SessionDataSource;
  children: ReactNode;
}) => (
  <SessionDataContext.Provider value={value}>
    {children}
  </SessionDataContext.Provider>
);

const useResolvedSessionData = (
  source: SessionDataSource | undefined,
): SessionData | null =>
  source instanceof Promise ? use(source) : (source ?? null);

export const useSessionData = (): SessionData => {
  const sessionData = useResolvedSessionData(useContext(SessionDataContext));
  if (!sessionData)
    throw new Error(
      "useSessionData must be used within <SessionDataProvider /> with a signed-in session",
    );
  return sessionData;
};

export const useSessionUser = (): CombinedUser | null =>
  useResolvedSessionData(useContext(SessionDataContext))?.user ?? null;
