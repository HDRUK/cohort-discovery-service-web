import { ApiResponse } from "@/types/api";
import { changesQueryQuota, QUERY_LIMIT_STATUS } from "../queryLimit";

const responseWith = (code?: number): ApiResponse<null> => ({
  message: "",
  data: null,
  ...(code !== undefined && { error: { text: "Nope", code } }),
});

describe("changesQueryQuota", () => {
  it("counts a query that ran", () => {
    expect(changesQueryQuota(responseWith())).toBe(true);
  });

  it("counts a query refused for the limit, so the quota is re-read", () => {
    expect(changesQueryQuota(responseWith(QUERY_LIMIT_STATUS))).toBe(true);
  });

  it("ignores any other error", () => {
    expect(changesQueryQuota(responseWith(500))).toBe(false);
  });
});
