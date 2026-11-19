import { ApiResponse } from "@/types/api";

export const QUERY_LIMIT_STATUS = 429;

export const changesQueryQuota = <T>({ error }: ApiResponse<T>): boolean =>
  !error || error.code === QUERY_LIMIT_STATUS;
