"use server";

import { apiGet } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, CollectionTaskHistory, TimeRange } from "@/types/api";

const PER_PAGE = 100;

const MAX_PAGES = 10;

const fetchPage = (pid: string, range: TimeRange, page: number) =>
  apiGet<ApiResponse<CollectionTaskHistory>>({
    url: API_ROUTES.collectionTaskHistory(pid),
    params: new URLSearchParams({
      from: range.from,
      to: range.to,
      per_page: String(PER_PAGE),
      page: String(page),
    }),
    cacheOptions: { useCache: false },
  });

const getCollectionTaskHistory = async (
  pid: string,
  range: TimeRange,
): Promise<ApiResponse<CollectionTaskHistory>> => {
  const first = await fetchPage(pid, range, 1);
  const paginator = first.data?.tasks;
  if (!paginator) return first;

  const pages = Math.min(paginator.last_page, MAX_PAGES);
  if (pages <= 1) return first;

  const rest = await Promise.all(
    Array.from({ length: pages - 1 }, (_, index) =>
      fetchPage(pid, range, index + 2),
    ),
  );

  return {
    ...first,
    data: {
      ...first.data,
      tasks: {
        ...paginator,
        data: [
          ...paginator.data,
          ...rest.flatMap((response) => response.data?.tasks?.data ?? []),
        ],
      },
    },
  };
};

export default getCollectionTaskHistory;
