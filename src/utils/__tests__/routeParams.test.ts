import {
  isPid,
  parseParseQueryBody,
  parseQueryListParams,
  parseSearchConceptsBody,
  parseTermDirectoryParams,
  parseTimeRange,
  toTermDirectoryParams,
} from "../routeParams";

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

describe("toTermDirectoryParams", () => {
  it("round-trips through parseTermDirectoryParams", () => {
    const params = {
      page: 2,
      perPage: 50,
      search: "asthma",
      domain: "person" as const,
      collections: ["col_a", "col_b"],
      sort: "name:asc",
    };

    expect(parseTermDirectoryParams(toTermDirectoryParams(params))).toEqual(
      params,
    );
  });
});

describe("parseTermDirectoryParams", () => {
  it("defaults the page and page size", () => {
    expect(parseTermDirectoryParams(new URLSearchParams())).toEqual({
      page: 1,
      perPage: 25,
      search: undefined,
      domain: undefined,
      collections: [],
      sort: undefined,
    });
  });

  it("clamps per_page", () => {
    expect(
      parseTermDirectoryParams(new URLSearchParams("per_page=100000"))?.perPage,
    ).toBe(200);
  });

  it.each([
    ["an unknown domain", "domain=everything"],
    ["an inherited property as the domain", "domain=constructor"],
    ["an invalid collection pid", "collections[]=../admin"],
    ["an overlong search", `search=${"a".repeat(256)}`],
  ])("returns null for %s", (_label, query) => {
    expect(parseTermDirectoryParams(new URLSearchParams(query))).toBeNull();
  });
});

describe("parseSearchConceptsBody", () => {
  it("keeps the known fields and clamps per_page", () => {
    expect(
      parseSearchConceptsBody({
        concept_name: ["asthma"],
        concept_id: ["asthma"],
        domain: "Condition",
        collections: ["col_a"],
        page: 1,
        per_page: 5000,
        url: "https://example.com",
      }),
    ).toEqual({
      concept_name: ["asthma"],
      concept_id: ["asthma"],
      domain: "Condition",
      collections: ["col_a"],
      page: 1,
      per_page: 200,
      include_ancestors: undefined,
    });
  });

  it.each([
    ["a non-object", "asthma"],
    ["a non-array search", { concept_name: "asthma" }],
    ["an invalid collection pid", { collections: ["a/b"] }],
    ["a fractional page", { page: 1.5 }],
  ])("returns null for %s", (_label, body) => {
    expect(parseSearchConceptsBody(body)).toBeNull();
  });
});

describe("parseParseQueryBody", () => {
  it("keeps the known fields", () => {
    expect(
      parseParseQueryBody({
        query: "adults with asthma",
        ignore_synthetic: true,
        collections: ["col_a"],
        extra: 1,
      }),
    ).toEqual({
      query: "adults with asthma",
      ignore_synthetic: true,
      prefer_non_synthetic: undefined,
      collections: ["col_a"],
    });
  });

  it.each([
    ["a missing query", {}],
    ["a blank query", { query: "  " }],
    ["an overlong query", { query: "a".repeat(10_001) }],
    ["a non-boolean flag", { query: "asthma", ignore_synthetic: "yes" }],
  ])("returns null for %s", (_label, body) => {
    expect(parseParseQueryBody(body)).toBeNull();
  });
});
