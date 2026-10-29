import {
  parseCollectionHostId,
  toCollectionHostCredentials,
  toCollectionHostSummary,
  toCustodianSummary,
} from "../collectionHosts";
import getCollectionHost from "@/actions/collectionHost/__mocks__/getCollectionHost";
import getCustodian from "@/actions/custodian/__mocks__/getCustodian";
import { Custodian } from "@/types/api";

const custodianWithHosts = (): Custodian =>
  ({
    ...getCustodian(),
    hosts: [getCollectionHost()],
  }) as Custodian;

describe("toCustodianSummary", () => {
  it("drops hosts the api sends alongside the custodian", () => {
    const summary = toCustodianSummary(custodianWithHosts());

    expect(summary).not.toHaveProperty("hosts");
  });

  it("keeps the fields the ui reads", () => {
    const custodian = getCustodian();

    expect(toCustodianSummary(custodian)).toEqual(
      expect.objectContaining({
        id: custodian.id,
        pid: custodian.pid,
        name: custodian.name,
        external_custodian_id: custodian.external_custodian_id,
      }),
    );
  });
});

describe("toCollectionHostSummary", () => {
  it("drops the client id and secret", () => {
    const summary = toCollectionHostSummary(getCollectionHost());

    expect(summary).not.toHaveProperty("client_id");
    expect(summary).not.toHaveProperty("client_secret");
  });

  it("drops hosts nested in the host's custodian", () => {
    const host = getCollectionHost({ custodian: custodianWithHosts() });

    expect(toCollectionHostSummary(host).custodian).not.toHaveProperty("hosts");
  });

  it("keeps the id and name used to pick a host", () => {
    const host = getCollectionHost({ id: 7, name: "Host seven" });

    expect(toCollectionHostSummary(host)).toEqual(
      expect.objectContaining({ id: 7, name: "Host seven" }),
    );
  });
});

describe("toCollectionHostCredentials", () => {
  it("returns only the id and credentials", () => {
    const host = getCollectionHost({
      id: 3,
      client_id: "client-id",
      client_secret: "client-secret",
    });

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
