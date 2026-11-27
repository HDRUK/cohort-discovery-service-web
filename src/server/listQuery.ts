import "server-only";

import { canonicaliseQueryString } from "@/utils/string";

export const toListQuery = (params?: URLSearchParams | string): string =>
  canonicaliseQueryString(params);
