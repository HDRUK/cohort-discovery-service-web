import { QueryClient } from "@tanstack/react-query";
import { receivedAt, setQueryDataIfNewer } from "../queryCache";

const KEY = ["queries", "page=1"];

const payload = (label = "server") => ({ label });

const clientWith = (data: object, updatedAt: number) => {
  const queryClient = new QueryClient();
  queryClient.setQueryData(KEY, data, { updatedAt });
  return queryClient;
};

const setNow = (now: number) => jest.spyOn(Date, "now").mockReturnValue(now);

afterEach(() => {
  jest.restoreAllMocks();
});

describe("receivedAt", () => {
  it("stamps a payload with the browser clock the first time it is seen", () => {
    setNow(1_000);

    expect(receivedAt(payload())).toBe(1_000);
  });

  it("keeps the first stamp when the same payload is seen again", () => {
    const reused = payload();
    setNow(1_000);
    receivedAt(reused);
    setNow(5_000);

    expect(receivedAt(reused)).toBe(1_000);
  });

  it("stamps each new payload separately", () => {
    setNow(1_000);
    receivedAt(payload());
    setNow(5_000);

    expect(receivedAt(payload())).toBe(5_000);
  });
});

describe("setQueryDataIfNewer", () => {
  it("writes server data into an empty cache", () => {
    const queryClient = new QueryClient();
    const server = payload();
    setNow(1_000);

    setQueryDataIfNewer(queryClient, KEY, server);

    expect(queryClient.getQueryData(KEY)).toBe(server);
    expect(queryClient.getQueryState(KEY)?.dataUpdatedAt).toBe(1_000);
  });

  it("replaces older polled data with newly received server data", () => {
    const queryClient = clientWith(payload("polled"), 1_000);
    const server = payload();
    setNow(2_000);

    setQueryDataIfNewer(queryClient, KEY, server);

    expect(queryClient.getQueryData(KEY)).toEqual(server);
  });

  it("keeps newer polled data over a server payload seen earlier", () => {
    const server = payload();
    setNow(1_000);
    receivedAt(server);
    const polled = payload("polled");
    const queryClient = clientWith(polled, 2_000);
    setNow(3_000);

    setQueryDataIfNewer(queryClient, KEY, server);

    expect(queryClient.getQueryData(KEY)).toBe(polled);
  });

  it("leaves the cache alone when the server data is the same age", () => {
    const polled = payload("polled");
    const queryClient = clientWith(polled, 1_000);
    setNow(1_000);

    setQueryDataIfNewer(queryClient, KEY, payload());

    expect(queryClient.getQueryData(KEY)).toBe(polled);
  });
});
