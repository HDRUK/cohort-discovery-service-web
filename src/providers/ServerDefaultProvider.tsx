import { ReactNode } from "react";
import { DefaultProvider, DefaultConfig } from "./DefaultProvider";

const envInt = (raw: string | undefined): number | undefined => {
  if (!raw || raw.trim() === "") return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
};

export default function ServerDefaultProvider({
  children,
}: {
  children: ReactNode;
}) {
  const overrides: Partial<DefaultConfig> = {
    tableRefresh: envInt(process.env.TABLE_REFRESH_INTERVAL),
    maxInvalidReasons: envInt(process.env.MAX_INVALID_REASONS),
    searchPrefetch: envInt(process.env.SEARCH_PREFETCH),
    searchWaitTime: envInt(process.env.SEARCH_WAIT_TIME),
    searchSuggestionRotation: envInt(process.env.SEARCH_SUGGESTION_ROTATION),
  };

  return <DefaultProvider overrides={overrides}>{children}</DefaultProvider>;
}
