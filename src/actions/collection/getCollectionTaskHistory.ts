"use server";

import {
  apiGet,
  CachedGetArgs,
  ErrorMode,
  RequestOptions,
} from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import {
  ApiResponse,
  CollectionTaskHistory,
  TaskHistoryTask,
  TimeRange,
} from "@/types/api";
import { RuleGroupType } from "@/types/rules";

const PER_PAGE = 100;

const MAX_PAGES = 10;

type TaskHistoryArgs = Omit<CachedGetArgs, "url"> & {
  options?: RequestOptions<undefined>;
};

const fetchPage = (
  pid: string,
  range: TimeRange,
  page: number,
  args?: TaskHistoryArgs,
) =>
  apiGet<ApiResponse<CollectionTaskHistory>>({
    url: API_ROUTES.collectionTaskHistory(pid),
    params: new URLSearchParams({
      from: range.from,
      to: range.to,
      per_page: String(PER_PAGE),
      page: String(page),
      include: "definition",
    }),
    cacheOptions: { useCache: false },
    ...args,
    options: { errorMode: ErrorMode.RESULT, ...args?.options },
  });

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

const getCollectionTaskHistory = async (
  pid: string,
  range: TimeRange,
  args?: TaskHistoryArgs,
): Promise<ApiResponse<CollectionTaskHistory>> => {
  const first = await fetchPage(pid, range, 1, args);
  const paginator = first.data?.tasks;
  if (!paginator) return first;

  const pages = Math.min(paginator.last_page, MAX_PAGES);

  const rest =
    pages <= 1
      ? []
      : await Promise.all(
          Array.from({ length: pages - 1 }, (_, index) =>
            fetchPage(pid, range, index + 2, args),
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

export default getCollectionTaskHistory;
