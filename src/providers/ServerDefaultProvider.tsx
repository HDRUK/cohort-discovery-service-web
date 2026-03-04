"use server";

import { ReactNode } from "react";
import { DefaultProvider, DefaultConfig } from "./DefaultProvider";

const envInt = (raw: string | undefined): number | undefined => {
  if (!raw || raw.trim() === "") return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
};

export default async function ServerDefaultProvider({
  children,
}: {
  children: ReactNode;
}) {
  const overrides: Partial<DefaultConfig> = {
    tableRefresh: envInt(process.env.DEFAULT_TABLE_REFRESH_INTERVAL),
    maxInvalidReasons: envInt(process.env.DEFAULT_MAX_INVALID_REASONS),
    searchPrefetch: envInt(process.env.DEFAULT_SEARCH_PREFETCH),
    searchWaitTime: envInt(process.env.DEFAULT_SEARCH_WAIT_TIME),
    searchSuggestionRotation: envInt(
      process.env.DEFAULT_SEARCH_SUGGESTION_ROTATION,
    ),
    serviceDeskUrl: process.env.CONFIG_SERVICE_DESK_URL,
    serviceDeskSupportSuffix: process.env.CONFIG_SERVICE_DESK_SUPPORT_SUFFIX,
    serviceDeskReportBugSuffix:
      process.env.CONFIG_SERVICE_DESK_REPORT_BUG_SUFFIX,
    supportUrl: process.env.CONFIG_SUPPORT_URL,
  };

  return <DefaultProvider overrides={overrides}>{children}</DefaultProvider>;
}
