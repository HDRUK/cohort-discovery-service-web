import { rangeMinutes } from "@/modules/CollectionHealth/timeRange";
import { buildQueryHistoryParams, clampPerPage } from "@/utils/params";
import { TimeRange } from "@/types/api";

const PID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;

export const isPid = (value: string): boolean => PID_PATTERN.test(value);

export const parseTimeRange = (
  searchParams: URLSearchParams,
): TimeRange | null => {
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  if (!from || !to) return null;

  const range = { from, to };
  return rangeMinutes(range) === null ? null : range;
};

const toPage = (value: string | null): number | undefined => {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : undefined;
};

export const parseQueryListParams = (
  searchParams: URLSearchParams,
): URLSearchParams =>
  buildQueryHistoryParams({
    page: toPage(searchParams.get("page")),
    per_page: clampPerPage(searchParams.get("per_page") ?? undefined),
    sort: searchParams.get("sort") ?? undefined,
    search_term: searchParams.get("name[]") ?? undefined,
  });
