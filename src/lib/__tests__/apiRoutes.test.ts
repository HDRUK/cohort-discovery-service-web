import { API_ROUTES } from "../apiRoutes";

describe("API_ROUTES", () => {
  it("encodes a pid containing a slash", () => {
    expect(API_ROUTES.getQuery("../users")).toBe("/api/v1/query/..%2Fusers");
  });

  it("encodes both ids in a nested path", () => {
    expect(API_ROUTES.collectionWorkgroup("a/b", "c?d")).toBe(
      "/api/v1/collections/a%2Fb/workgroup/c%3Fd",
    );
  });
});
