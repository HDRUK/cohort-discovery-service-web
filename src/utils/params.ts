import {
  CollectionHostsSearchParams,
  CollectionsSearchParams,
  ConceptSearchParams,
  QueryHistorySearchParams,
  SearchParams,
  SearchParamValue,
} from "@/types/api";
import { CollectionHostFilter } from "@/types/collections";
import { MAX_PER_PAGE } from "@/config/defaults";

export const buildSearchParams = <
  T extends Record<string, SearchParamValue> = SearchParams,
>(
  params: Partial<T> = {},
): URLSearchParams => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v !== undefined && v !== null) {
          searchParams.append(key, String(v));
        }
      });
    } else {
      searchParams.set(key, String(value));
    }
  });

  return searchParams;
};

export const clampPerPage = (perPage?: number | string): number | undefined => {
  const value = Math.floor(Number(perPage));
  if (!Number.isFinite(value) || value < 1) return undefined;
  return Math.min(value, MAX_PER_PAGE);
};

export const buildCollectionParams = (
  searchParams: CollectionsSearchParams,
) => {
  const { page, per_page, workgroup_filter, collection_filter, search_term } =
    searchParams ?? {};

  const params = {
    page,
    per_page: clampPerPage(per_page),
    ...(workgroup_filter ? { workgroup_id: workgroup_filter } : {}),
    ...(collection_filter ? { state: collection_filter } : {}),
    ...(search_term ? { ["name[]"]: search_term } : {}),
  };

  return buildSearchParams(params);
};

export const buildCollectionHostParams = (
  searchParams: CollectionHostsSearchParams,
) => {
  const { sort, collection_host_filter } = searchParams ?? {};

  return buildSearchParams({
    sort,
    ...(collection_host_filter === CollectionHostFilter.DELETED
      ? { trashed: "only" }
      : {}),
  });
};

export const buildQueryHistoryParams = (
  searchParams: QueryHistorySearchParams,
) => {
  const { page, per_page, sort, search_term } = searchParams;

  return buildSearchParams({
    page,
    per_page: clampPerPage(per_page),
    sort,
    ...(search_term ? { ["name[]"]: search_term } : {}),
  });
};

export const buildConceptSearchParams = (searchParams: ConceptSearchParams) => {
  const {
    page,
    per_page,
    search_term: searchTerm,
    domain,
    collections,
  } = searchParams ?? {};

  const params = {
    page,
    per_page,
    ...(searchTerm
      ? { "concept_name[]": searchTerm, "concept_id[]": searchTerm }
      : {}),
    domain,
    "collections[]": collections,
  };

  return buildSearchParams(params);
};
