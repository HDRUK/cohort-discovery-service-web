import "server-only";

import { cacheLife } from "next/cache";
import { API_ROUTES } from "@/lib/apiRoutes";
import { apiGet, ErrorMode } from "@/server/api";
import { LIST_CACHE_LIFE, USER_DATA_CACHE_LIFE } from "@/server/cacheProfiles";
import { requireSession } from "@/server/session";
import {
  ApiResponse,
  Collection,
  CollectionDetails,
  CollectionHealthSeries,
  CollectionTaskHistory,
  CollectionWithHosts,
  Paginated,
  ReadArgs,
  TaskHistoryTask,
  TimeRange,
} from "@/types/api";
import { RuleGroupType } from "@/types/rules";
import { canonicaliseQueryString } from "@/utils/string";

const TASK_HISTORY_PER_PAGE = 100;

const TASK_HISTORY_MAX_PAGES = 10;

export const getUserCollections = async (): Promise<
  ApiResponse<Collection[]>
> => {
  "use cache: private";
  cacheLife(USER_DATA_CACHE_LIFE);

  const { token } = await requireSession();
  return apiGet<ApiResponse<Collection[]>>(token, API_ROUTES.userCollections);
};

export const getCollections = async (): Promise<ApiResponse<Collection[]>> => {
  const { token } = await requireSession();
  return apiGet<ApiResponse<Collection[]>>(token, API_ROUTES.collections);
};

export const getAdminCollections = async (
  args?: ReadArgs,
): Promise<ApiResponse<Paginated<CollectionWithHosts>>> => {
  const { token } = await requireSession();
  return apiGet<ApiResponse<Paginated<CollectionWithHosts>>>(
    token,
    API_ROUTES.adminCollections,
    { params: args?.params },
  );
};

const fetchAdminCollectionList = async (
  queryString: string,
): Promise<ApiResponse<Paginated<CollectionWithHosts>>> => {
  "use cache: private";
  cacheLife(LIST_CACHE_LIFE);

  const { token } = await requireSession();
  return apiGet<ApiResponse<Paginated<CollectionWithHosts>>>(
    token,
    API_ROUTES.adminCollections,
    { params: queryString },
  );
};

export const getAdminCollectionList = (
  args?: ReadArgs,
): Promise<ApiResponse<Paginated<CollectionWithHosts>>> =>
  fetchAdminCollectionList(canonicaliseQueryString(args?.params));

const fetchCustodianCollections = async (
  custodianPid: string,
  queryString: string,
): Promise<ApiResponse<Paginated<CollectionWithHosts>>> => {
  "use cache: private";
  cacheLife(LIST_CACHE_LIFE);

  const { token } = await requireSession();
  return apiGet<ApiResponse<Paginated<CollectionWithHosts>>>(
    token,
    API_ROUTES.custodianCollections(custodianPid),
    { params: queryString },
  );
};

export const getCustodianCollections = (
  custodianPid: string,
  args?: ReadArgs,
): Promise<ApiResponse<Paginated<CollectionWithHosts>>> =>
  fetchCustodianCollections(
    custodianPid,
    canonicaliseQueryString(args?.params),
  );

export const getCollectionDetails = async (
  pid: string,
): Promise<CollectionDetails> => {
  const { token } = await requireSession();
  const { data } = await apiGet<ApiResponse<CollectionDetails>>(
    token,
    API_ROUTES.collectionDetails(pid),
  );
  return data;
};

export const getCollectionHealth = async (
  pid: string,
  bin: string,
  range: TimeRange,
): Promise<ApiResponse<CollectionHealthSeries>> => {
  const { token } = await requireSession();
  return apiGet<ApiResponse<CollectionHealthSeries>>(
    token,
    API_ROUTES.collectionHealth(pid),
    {
      params: new URLSearchParams({ bin, from: range.from, to: range.to }),
      errorMode: ErrorMode.RESULT,
    },
  );
};

const fetchTaskHistoryPage = (
  token: string,
  pid: string,
  range: TimeRange,
  page: number,
) =>
  apiGet<ApiResponse<CollectionTaskHistory>>(
    token,
    API_ROUTES.collectionTaskHistory(pid),
    {
      params: new URLSearchParams({
        from: range.from,
        to: range.to,
        per_page: String(TASK_HISTORY_PER_PAGE),
        page: String(page),
        include: "definition",
      }),
      errorMode: ErrorMode.RESULT,
    },
  );

const hoistDefinitions = (
  tasks: TaskHistoryTask[],
): {
  tasks: TaskHistoryTask[];
  definitionsByPid: Record<string, RuleGroupType>;
} => {
  const definitionsByPid: Record<string, RuleGroupType> = {};

  const stripped = tasks.map((task) => {
    const { query } = task;
    if (!query?.definition) return task;

    definitionsByPid[query.pid] ??= query.definition;

    return {
      ...task,
      query: {
        pid: query.pid,
        name: query.name,
        query_type: query.query_type,
      },
    };
  });

  return { tasks: stripped, definitionsByPid };
};

export const getCollectionTaskHistory = async (
  pid: string,
  range: TimeRange,
): Promise<ApiResponse<CollectionTaskHistory>> => {
  const { token } = await requireSession();
  const first = await fetchTaskHistoryPage(token, pid, range, 1);
  const paginator = first.data?.tasks;
  if (!paginator) return first;

  const pages = Math.min(paginator.last_page, TASK_HISTORY_MAX_PAGES);

  const rest =
    pages <= 1
      ? []
      : await Promise.all(
          Array.from({ length: pages - 1 }, (_, index) =>
            fetchTaskHistoryPage(token, pid, range, index + 2),
          ),
        );

  const { tasks, definitionsByPid } = hoistDefinitions([
    ...paginator.data,
    ...rest.flatMap((response) => response.data?.tasks?.data ?? []),
  ]);

  return {
    ...first,
    data: {
      ...first.data,
      tasks: { ...paginator, data: tasks },
      definitionsByPid,
    },
  };
};
