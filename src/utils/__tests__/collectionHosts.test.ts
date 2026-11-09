import {
  parseCollectionHostId,
  toCollectionHostCredentials,
} from "../collectionHosts";
import getCollectionHost from "@/actions/collectionHost/__mocks__/getCollectionHost";

describe("toCollectionHostCredentials", () => {
  it("returns only the id and credentials", () => {
    const host = {
      ...getCollectionHost({ id: 3 }),
      client_id: "client-id",
      client_secret: "client-secret",
    };

    expect(toCollectionHostCredentials(host)).toEqual({
      id: 3,
      client_id: "client-id",
      client_secret: "client-secret",
    });
  });
});

describe("parseCollectionHostId", () => {
  it("accepts a positive integer", () => {
    expect(parseCollectionHostId("42")).toBe(42);
  });

  it.each(["0", "-1", "1.5", "abc", "", "1/../2"])("rejects %p", (value) => {
    expect(parseCollectionHostId(value)).toBeNull();
  });
});
