"use client";

import { useQueries } from "@tanstack/react-query";
import { useSearchParams, useSelectedLayoutSegment } from "next/navigation";
import TabsShell from "@/components/TabsShell";
import { routes } from "@/config/routes";
import { QUERY_KEYS } from "@/config/tags";
import { routeGet } from "@/lib/routeFetch";
import { ApiResponse, Query } from "@/types/api";
import {
  buildDashboardTabs,
  parseOpenQueries,
  resultTabLabel,
} from "../dashboardTabs";

const DashboardTabs = () => {
  const searchParams = useSearchParams();
  const segment = useSelectedLayoutSegment();
  const openQueries = parseOpenQueries(searchParams.get("open_queries"));

  const openQueryResults = useQueries({
    queries: openQueries.map((pid) => ({
      queryKey: QUERY_KEYS.query(pid),
      queryFn: () => routeGet<ApiResponse<Query>>(routes.api.query(pid)),
      staleTime: Infinity,
    })),
  });

  const tabs = buildDashboardTabs(openQueries, (pid) =>
    resultTabLabel(openQueryResults[openQueries.indexOf(pid)]?.data?.data, pid),
  );

  return (
    <TabsShell
      tabs={tabs}
      value={segment ?? tabs[0].id}
      forceValue
      sx={{ height: "auto", flex: "none" }}
    />
  );
};

export default DashboardTabs;
