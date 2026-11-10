import { isPid, parseQueryListParams, parseTimeRange } from "../routeParams";

const RANGE = {
  from: "2026-09-07T00:00:00.000Z",
  to: "2026-09-07T01:00:00.000Z",
};

describe("isPid", () => {
  it.each(["3f2b8c1e-9a4d-4e6f-8b2a-1c3d5e7f9a0b", "col_abc123", "col-pid-1"])(
    "accepts %s",
    (pid) => {
      expect(isPid(pid)).toBe(true);
    },
  );

  it.each(["", "../admin", "abc?x=1", "a/b", "a".repeat(65)])(
    "rejects %p",
    (pid) => {
      expect(isPid(pid)).toBe(false);
    },
  );
});

describe("parseTimeRange", () => {
  it("returns the range when both ends are valid and in order", () => {
    expect(parseTimeRange(new URLSearchParams(RANGE))).toEqual(RANGE);
  });

  it("returns null when an end is missing", () => {
    expect(
      parseTimeRange(new URLSearchParams({ from: RANGE.from })),
    ).toBeNull();
  });

  it("returns null for an unparseable date", () => {
    expect(
      parseTimeRange(new URLSearchParams({ from: "soon", to: RANGE.to })),
    ).toBeNull();
  });

  it("returns null when the range runs backwards", () => {
    expect(
      parseTimeRange(new URLSearchParams({ from: RANGE.to, to: RANGE.from })),
    ).toBeNull();
  });
});

describe("parseQueryListParams", () => {
  it("keeps only the params the API takes", () => {
    const params = parseQueryListParams(
      new URLSearchParams(
        "page=2&per_page=10&sort=name:asc&name[]=diabetes&open_queries=a,b&url=https://example.com",
      ),
    );

    expect(Object.fromEntries(params)).toEqual({
      page: "2",
      per_page: "10",
      sort: "name:asc",
      "name[]": "diabetes",
    });
  });

  it("clamps per_page and drops an invalid page", () => {
    const params = parseQueryListParams(
      new URLSearchParams("page=-1&per_page=100000"),
    );

    expect(params.get("page")).toBeNull();
    expect(params.get("per_page")).toBe("200");
  });
});
