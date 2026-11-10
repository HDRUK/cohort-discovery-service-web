import { rangeMinutes } from "@/modules/CollectionHealth/timeRange";
import { buildQueryHistoryParams, clampPerPage } from "@/utils/params";
import { ParseQueryBody, SearchConceptsBody, TimeRange } from "@/types/api";
import { DEFAULT_PER_PAGE } from "@/config/defaults";
import { DOMAIN_TAB_FILTERS, DomainTab } from "@/config/domainFilters";

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

const MAX_SEARCH_TERM_LENGTH = 255;
const MAX_QUERY_TEXT_LENGTH = 10_000;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isSearchTerms = (value: unknown): value is string[] =>
  Array.isArray(value) &&
  value.every(
    (term) => typeof term === "string" && term.length <= MAX_SEARCH_TERM_LENGTH,
  );

const isPids = (value: unknown): value is string[] =>
  Array.isArray(value) &&
  value.every((pid) => typeof pid === "string" && isPid(pid));

const isOptional = <T>(
  value: unknown,
  check: (value: unknown) => value is T,
): value is T | undefined => value === undefined || check(value);

const isBoolean = (value: unknown): value is boolean =>
  typeof value === "boolean";

const isShortString = (value: unknown): value is string =>
  typeof value === "string" && value.length <= MAX_SEARCH_TERM_LENGTH;

const isPositiveInteger = (value: unknown): value is number =>
  Number.isInteger(value) && (value as number) > 0;

export interface TermDirectoryParams {
  page: number;
  perPage: number;
  search?: string;
  domain?: DomainTab;
  collections: string[];
  sort?: string;
}

export const toTermDirectoryParams = ({
  page,
  perPage,
  search,
  domain,
  collections,
  sort,
}: TermDirectoryParams): URLSearchParams => {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });
  if (search) params.set("search", search);
  if (domain) params.set("domain", domain);
  collections.forEach((pid) => params.append("collections[]", pid));
  if (sort) params.set("sort", sort);
  return params;
};

export const parseTermDirectoryParams = (
  searchParams: URLSearchParams,
): TermDirectoryParams | null => {
  const domain = searchParams.get("domain") ?? undefined;
  if (domain !== undefined && !(domain in DOMAIN_TAB_FILTERS)) return null;

  const collections = searchParams.getAll("collections[]");
  if (!isPids(collections)) return null;

  const search = searchParams.get("search") ?? undefined;
  if (search !== undefined && !isShortString(search)) return null;

  return {
    page: toPage(searchParams.get("page")) ?? 1,
    perPage:
      clampPerPage(searchParams.get("per_page") ?? undefined) ??
      DEFAULT_PER_PAGE,
    search,
    domain: domain as DomainTab | undefined,
    collections,
    sort: searchParams.get("sort") ?? undefined,
  };
};

export const parseSearchConceptsBody = (
  body: unknown,
): SearchConceptsBody | null => {
  if (!isRecord(body)) return null;

  const {
    concept_name,
    concept_id,
    domain,
    collections,
    page,
    per_page,
    include_ancestors,
  } = body;

  if (
    !isOptional(concept_name, isSearchTerms) ||
    !isOptional(concept_id, isSearchTerms) ||
    !isOptional(domain, isShortString) ||
    !isOptional(collections, isPids) ||
    !isOptional(page, isPositiveInteger) ||
    !isOptional(per_page, isPositiveInteger) ||
    !isOptional(include_ancestors, isBoolean)
  ) {
    return null;
  }

  return {
    concept_name,
    concept_id,
    domain,
    collections,
    page,
    per_page: clampPerPage(per_page),
    include_ancestors,
  };
};

export const parseParseQueryBody = (body: unknown): ParseQueryBody | null => {
  if (!isRecord(body)) return null;

  const { query, ignore_synthetic, prefer_non_synthetic, collections } = body;

  if (
    typeof query !== "string" ||
    !query.trim() ||
    query.length > MAX_QUERY_TEXT_LENGTH ||
    !isOptional(ignore_synthetic, isBoolean) ||
    !isOptional(prefer_non_synthetic, isBoolean) ||
    !isOptional(collections, isPids)
  ) {
    return null;
  }

  return { query, ignore_synthetic, prefer_non_synthetic, collections };
};
