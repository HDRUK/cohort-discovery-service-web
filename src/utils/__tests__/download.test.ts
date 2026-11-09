import { parseDownloadParams } from "../download";

const paramsOf = (query: string) => new URLSearchParams(query);

describe("parseDownloadParams", () => {
  it("accepts queries as csv", () => {
    expect(parseDownloadParams(paramsOf("entity=queries&format=csv"))).toEqual({
      entity: "queries",
      format: "csv",
    });
  });

  it("accepts queries as json", () => {
    expect(parseDownloadParams(paramsOf("entity=queries&format=json"))).toEqual(
      { entity: "queries", format: "json" },
    );
  });

  it("defaults to queries as csv", () => {
    expect(parseDownloadParams(paramsOf(""))).toEqual({
      entity: "queries",
      format: "csv",
    });
  });

  it("rejects an unknown entity", () => {
    expect(parseDownloadParams(paramsOf("entity=users&format=csv"))).toBeNull();
  });

  it("rejects an unknown format", () => {
    expect(
      parseDownloadParams(paramsOf("entity=queries&format=../../users")),
    ).toBeNull();
  });
});
