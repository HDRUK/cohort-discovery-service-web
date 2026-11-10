import { API_ROUTES } from "../apiRoutes";

describe("API_ROUTES", () => {
  it("builds the same paths for valid ids, pids and flag names", () => {
    expect(API_ROUTES.feature("query-builder-use-value-as-number")).toBe(
      "/api/v1/features/query-builder-use-value-as-number",
    );
    expect(API_ROUTES.getQuery("9b2f6c1e-4a3d-4c1b-9f0e-2d7a8b6c5e41")).toBe(
      "/api/v1/query/9b2f6c1e-4a3d-4c1b-9f0e-2d7a8b6c5e41",
    );
    expect(API_ROUTES.custodianNetwork(12, 3)).toBe(
      "/api/v1/custodians/12/networks/3",
    );
    expect(API_ROUTES.download("queries", "abc_123", "csv")).toBe(
      "/api/v1/queries/abc_123/download/csv",
    );
  });

  it.each(["..", ".", "../users/5?x=", "a/b", "a?b", "a#b", "%2e%2e", ""])(
    "rejects %p as a path segment",
    (value) => {
      expect(() => API_ROUTES.feature(value)).toThrow(
        "Invalid API path segment",
      );
    },
  );

  it("rejects a non-numeric value passed where an id is typed as a number", () => {
    expect(() =>
      API_ROUTES.user("5/../../features" as unknown as number),
    ).toThrow("Invalid API path segment");
  });
});
