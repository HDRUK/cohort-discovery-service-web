import "server-only";

import { canonicaliseQueryString } from "@/utils/string";

const SEARCH_PARAMS = ["name[]", "email[]"];

export const toListQuery = (params?: URLSearchParams | string): string =>
  canonicaliseQueryString(params);

export const isSearchQuery = (queryString: string): boolean => {
  const params = new URLSearchParams(queryString);
  return SEARCH_PARAMS.some((key) => params.has(key));
};
