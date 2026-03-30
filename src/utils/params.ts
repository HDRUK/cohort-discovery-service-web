import {
  CollectionsSearchParams,
  ConceptSearchParams,
  QueryHistorySearchParams,
  SearchParams,
  SearchParamValue,
} from "@/types/api";

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

export const buildCollectionParams = (
  searchParams: CollectionsSearchParams,
) => {
  const { page, per_page, workgroup_filter, collection_filter, search_term } =
    searchParams ?? {};

  const params = {
    page,
    per_page,
    ...(workgroup_filter ? { workgroup_id: workgroup_filter } : {}),
    ...(collection_filter ? { state: collection_filter } : {}),
    ...(search_term ? { ["name[]"]: search_term } : {}),
  };

  return buildSearchParams(params);
};

export const buildQueryHistoryParams = (
  searchParams: QueryHistorySearchParams,
) => {
  const { search_term, ...rest } = searchParams;
  const params = {
    ...rest,
    ...(search_term ? { ["name[]"]: search_term } : {}),
  };

  return buildSearchParams(params);
};

export const buildConceptSearchParams = (searchParams: ConceptSearchParams) => {
  const { page, per_page, search_term: searchTerm } = searchParams ?? {};

  const params = {
    page,
    per_page,
    ...(searchTerm
      ? { "concept_name[]": searchTerm, "concept_id[]": searchTerm }
      : {}),
    //domain
  };

  return buildSearchParams(params);
};
