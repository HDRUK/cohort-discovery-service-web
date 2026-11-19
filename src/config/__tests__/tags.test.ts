import { QueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../tags";

const RANGE = {
  from: "2026-09-07T00:00:00.000Z",
  to: "2026-09-07T01:00:00.000Z",
};

describe("QUERY_KEYS", () => {
  it("returns the same key for the same arguments", () => {
    expect(QUERY_KEYS.queries("page=2")).toEqual(QUERY_KEYS.queries("page=2"));
    expect(QUERY_KEYS.collectionTaskHistory("abc", RANGE)).toEqual(
      QUERY_KEYS.collectionTaskHistory("abc", RANGE),
    );
  });

  it("leaves out arguments that aren't given", () => {
    expect(QUERY_KEYS.queries()).toEqual(["queries"]);
    expect(QUERY_KEYS.collectionDetails()).toEqual(["collection-details"]);
  });

  it("starts every key with its domain so prefixes match", () => {
    expect(QUERY_KEYS.query("q-1", "page=1")[0]).toBe("query");
    expect(QUERY_KEYS.collectionHealthSeries("abc", "1h", RANGE)[0]).toBe(
      "collection-health",
    );
  });

  it("marks every page of the query list stale from the root key", async () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(QUERY_KEYS.queries("page=1"), []);
    queryClient.setQueryData(QUERY_KEYS.queries("page=2"), []);
    queryClient.setQueryData(QUERY_KEYS.query("q-1"), {});

    await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.queries() });

    expect(
      queryClient.getQueryState(QUERY_KEYS.queries("page=1"))?.isInvalidated,
    ).toBe(true);
    expect(
      queryClient.getQueryState(QUERY_KEYS.queries("page=2"))?.isInvalidated,
    ).toBe(true);
    expect(
      queryClient.getQueryState(QUERY_KEYS.query("q-1"))?.isInvalidated,
    ).toBe(false);
  });
});
