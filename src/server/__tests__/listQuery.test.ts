import { isSearchQuery, toListQuery } from "../listQuery";

describe("toListQuery", () => {
  it("gives the same string whatever the parameter order", () => {
    expect(toListQuery("per_page=25&page=2")).toBe(
      toListQuery(new URLSearchParams({ page: "2", per_page: "25" })),
    );
  });

  it("gives an empty string without params", () => {
    expect(toListQuery()).toBe("");
  });
});

describe("isSearchQuery", () => {
  it("treats a name search as a search", () => {
    expect(isSearchQuery(toListQuery("page=1&name%5B%5D=cohort"))).toBe(true);
  });

  it("treats an email search as a search", () => {
    expect(isSearchQuery("email%5B%5D=user%40example.com")).toBe(true);
  });

  it("doesn't treat paging and filters as a search", () => {
    expect(isSearchQuery("page=2&per_page=25&state=draft")).toBe(false);
  });
});
