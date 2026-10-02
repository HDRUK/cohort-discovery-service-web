import {
  AvailableFormats,
  DOWNLOAD_TARGETS,
  downloadHref,
  isDownloadEntity,
} from "../downloads";

describe("isDownloadEntity", () => {
  it("accepts the registered entities", () => {
    expect(isDownloadEntity("queries")).toBe(true);
    expect(isDownloadEntity("term-directory")).toBe(true);
  });

  it("rejects a traversal attempt", () => {
    expect(isDownloadEntity("../../x")).toBe(false);
    expect(isDownloadEntity("..%2F..%2Fx")).toBe(false);
  });

  it("rejects inherited object properties", () => {
    expect(isDownloadEntity("constructor")).toBe(false);
    expect(isDownloadEntity("toString")).toBe(false);
  });
});

describe("downloadHref", () => {
  it("builds a pid-keyed href", () => {
    expect(
      downloadHref({
        entity: "queries",
        pid: "0f3a-1234",
        format: AvailableFormats.JSON,
      }),
    ).toBe("/api/download/queries/0f3a-1234?format=json");
  });

  it("omits the pid segment for an export", () => {
    expect(
      downloadHref({ entity: "term-directory", format: AvailableFormats.CSV }),
    ).toBe("/api/download/term-directory?format=csv");
  });

  it("forwards the caller's params alongside the format", () => {
    const href = downloadHref({
      entity: "term-directory",
      format: AvailableFormats.CSV,
      params: "domain=Condition&search_term=asthma",
    });

    const { searchParams } = new URL(href, "http://localhost");

    expect(searchParams.get("domain")).toBe("Condition");
    expect(searchParams.get("search_term")).toBe("asthma");
    expect(searchParams.get("format")).toBe("csv");
  });

  it("encodes a pid so it cannot escape its segment", () => {
    expect(
      downloadHref({
        entity: "queries",
        pid: "../../admin",
        format: AvailableFormats.JSON,
      }),
    ).toBe("/api/download/queries/..%2F..%2Fadmin?format=json");
  });
});

describe("DOWNLOAD_TARGETS", () => {
  it("exports the term directory at a fixed page size, ignoring the table's paging", () => {
    const params = DOWNLOAD_TARGETS["term-directory"].backendParams(
      new URLSearchParams("page=4&per_page=10&search_term=asthma"),
    );

    expect(params.get("page")).toBe("1");
    expect(params.get("per_page")).toBe("100");
    expect(params.get("concept_name")).toBe("asthma");
  });

  it("builds a query download url with the pid encoded", () => {
    const { backendUrl, filename } = DOWNLOAD_TARGETS.queries;

    expect(backendUrl("0f3a-1234", AvailableFormats.JSON)).toBe(
      "/api/v1/queries/0f3a-1234/download/json",
    );
    expect(backendUrl("../../admin", AvailableFormats.JSON)).toBe(
      "/api/v1/queries/..%2F..%2Fadmin/download/json",
    );
    expect(filename("0f3a-1234", AvailableFormats.JSON)).toBe(
      "query-0f3a-1234.json",
    );
  });
});
