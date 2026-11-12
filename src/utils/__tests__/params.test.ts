import {
  buildCollectionHostParams,
  buildCollectionParams,
  buildQueryHistoryParams,
  clampPerPage,
} from "../params";
import { CollectionHostFilter } from "@/types/collections";

describe("buildCollectionHostParams", () => {
  it("asks for only trashed hosts on the deleted filter", () => {
    const params = buildCollectionHostParams({
      collection_host_filter: CollectionHostFilter.DELETED,
    });

    expect(params.get("trashed")).toBe("only");
  });

  it("leaves trashed out on the all filter", () => {
    const params = buildCollectionHostParams({
      collection_host_filter: CollectionHostFilter.ALL,
    });

    expect(params.has("trashed")).toBe(false);
  });

  it("never forwards the filter name to the api", () => {
    const params = buildCollectionHostParams({
      sort: "name:asc",
      collection_host_filter: CollectionHostFilter.DELETED,
    });

    expect(params.has("collection_host_filter")).toBe(false);
    expect(params.get("sort")).toBe("name:asc");
  });
});

describe("clampPerPage", () => {
  it("keeps a page size inside the allowed range", () => {
    expect(clampPerPage(25)).toBe(25);
  });

  it("caps a page size above the maximum", () => {
    expect(clampPerPage(100000)).toBe(200);
  });

  it("drops a page size that isn't a positive number", () => {
    expect(clampPerPage("lots")).toBeUndefined();
    expect(clampPerPage(0)).toBeUndefined();
  });
});

describe("buildQueryHistoryParams", () => {
  it("strips the open tabs and the selected query", () => {
    const params = buildQueryHistoryParams({
      page: 2,
      query: "q-1",
      open_queries: ["q-1", "q-2"],
    });

    expect(params.has("query")).toBe(false);
    expect(params.has("open_queries")).toBe(false);
    expect(params.get("page")).toBe("2");
  });

  it("maps the search term to name[]", () => {
    const params = buildQueryHistoryParams({ search_term: "diabetes" });

    expect(params.get("name[]")).toBe("diabetes");
  });

  it("clamps per_page", () => {
    const params = buildQueryHistoryParams({ per_page: 100000 });

    expect(params.get("per_page")).toBe("200");
  });
});

describe("buildCollectionParams", () => {
  it("clamps per_page", () => {
    const params = buildCollectionParams({ per_page: 100000 });

    expect(params.get("per_page")).toBe("200");
  });
});
