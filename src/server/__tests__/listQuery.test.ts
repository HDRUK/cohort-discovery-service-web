import { toListQuery } from "../listQuery";

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
