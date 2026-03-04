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
  serviceDeskUrl: string;
  serviceDeskSupportSuffix: string;
  serviceDeskReportBugSuffix: string;
  supportUrl: string;
};

const DefaultContext = createContext<DefaultConfig | null>(null);

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
      serviceDeskUrl: "",
      serviceDeskSupportSuffix: "",
      serviceDeskReportBugSuffix: "",
      supportUrl: "",
      ...overrides,
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
