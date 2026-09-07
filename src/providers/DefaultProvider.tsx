"use client";

import { createContext, useContext, ReactNode, useMemo } from "react";
import * as defaults from "@/config/defaults";

export const envInt = (raw: string | undefined, fallback: number) => {
  if (raw == null || raw.trim() === "") return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
};

export type DefaultConfig = {
  tableRefresh: number;
  maxInvalidReasons: number;
  searchPrefetch: number;
  searchWaitTime: number;
  searchSuggestionRotation: number;
  pingAWarnMs: number;
  pingAFailMs: number;
  pingBWarnMs: number;
  pingBFailMs: number;
  serviceDeskUrl: string;
  serviceDeskSupportSuffix: string;
  serviceDeskReportBugSuffix: string;
  supportUrl: string;
};

const DefaultContext = createContext<DefaultConfig | null>(null);

// Overrides arrive with a key per env var, unset ones being `undefined`. Spread
// as-is they would blank the defaults they are meant to fall back to.
const definedOnly = (overrides: Partial<DefaultConfig> = {}) =>
  Object.fromEntries(
    Object.entries(overrides).filter(([, value]) => value !== undefined),
  ) as Partial<DefaultConfig>;

export const DefaultProvider = ({
  children,
  overrides,
}: {
  children: ReactNode;
  overrides?: Partial<DefaultConfig>;
}) => {
  const value = useMemo<DefaultConfig>(
    () => ({
      tableRefresh: defaults.DEFAULT_REFRESH_TABLE,
      maxInvalidReasons: defaults.DEFAULT_MAX_INVALID_REASONS,
      searchPrefetch: defaults.DEFAULT_SEARCH_PREFETCH,
      searchWaitTime: defaults.DEFAULT_SEARCH_WAIT_TIME,
      searchSuggestionRotation: defaults.DEFAULT_SEARCH_SUGGESTION_ROTATION,
      pingAWarnMs: defaults.DEFAULT_PING_A_WARN_MS,
      pingAFailMs: defaults.DEFAULT_PING_A_FAIL_MS,
      pingBWarnMs: defaults.DEFAULT_PING_B_WARN_MS,
      pingBFailMs: defaults.DEFAULT_PING_B_FAIL_MS,
      serviceDeskUrl: "",
      serviceDeskSupportSuffix: "",
      serviceDeskReportBugSuffix: "",
      supportUrl: "",
      ...definedOnly(overrides),
    }),
    [overrides],
  );

  return (
    <DefaultContext.Provider value={value}>{children}</DefaultContext.Provider>
  );
};

export const useDefaults = () => {
  const ctx = useContext(DefaultContext);
  if (!ctx) throw new Error("useDefaults must be used inside DefaultProvider");
  return ctx;
};
