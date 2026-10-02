import { AvailableFormats, downloadHref } from "./downloadHref";

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
