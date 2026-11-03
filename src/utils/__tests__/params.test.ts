import { buildCollectionHostParams } from "../params";
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
