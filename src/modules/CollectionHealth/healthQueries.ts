import { routes } from "@/config/routes";
import { routeGet } from "@/lib/routeGet";
import {
  ApiResponse,
  CollectionHealthSeries,
  CollectionTaskHistory,
  CollectionWithHosts,
  Paginated,
  RegressionTest,
  TimeRange,
} from "@/types/api";

export const fetchCollectionHealth = (
  pid: string,
  bin: string,
  range: TimeRange,
) =>
  routeGet<ApiResponse<CollectionHealthSeries>>(
    routes.api.collectionHealth(
      pid,
      new URLSearchParams({ bin, from: range.from, to: range.to }),
    ),
  );

export const fetchCollectionTaskHistory = (pid: string, range: TimeRange) =>
  routeGet<ApiResponse<CollectionTaskHistory>>(
    routes.api.collectionTaskHistory(pid, new URLSearchParams({ ...range })),
  );

export const fetchHealthCollections = (pid?: string) =>
  routeGet<ApiResponse<Paginated<CollectionWithHosts>>>(
    routes.api.adminCollectionHealth(pid),
  );

export const fetchRegressionTests = () =>
  routeGet<ApiResponse<RegressionTest[]>>(routes.api.regressionTests);
