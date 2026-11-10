import { QueryClient } from "@tanstack/react-query";
import { setQueryDataIfNewer } from "../queryCache";

const KEY = ["queries", "page=1"];

const clientWith = (data: string, updatedAt: number) => {
  const queryClient = new QueryClient();
  queryClient.setQueryData(KEY, data, { updatedAt });
  return queryClient;
};

describe("setQueryDataIfNewer", () => {
  it("writes server data into an empty cache", () => {
    const queryClient = new QueryClient();

    setQueryDataIfNewer(queryClient, KEY, "server", 1_000);

    expect(queryClient.getQueryData(KEY)).toBe("server");
    expect(queryClient.getQueryState(KEY)?.dataUpdatedAt).toBe(1_000);
  });

  it("replaces older polled data with newer server data", () => {
    const queryClient = clientWith("polled", 1_000);

    setQueryDataIfNewer(queryClient, KEY, "server", 2_000);

    expect(queryClient.getQueryData(KEY)).toBe("server");
  });

  it("keeps newer polled data over older server data", () => {
    const queryClient = clientWith("polled", 2_000);

    setQueryDataIfNewer(queryClient, KEY, "server", 1_000);

    expect(queryClient.getQueryData(KEY)).toBe("polled");
  });

  it("leaves the cache alone when the server data is the same age", () => {
    const queryClient = clientWith("polled", 1_000);

    setQueryDataIfNewer(queryClient, KEY, "server", 1_000);

    expect(queryClient.getQueryData(KEY)).toBe("polled");
  });
});
