import type { getQueryClient as GetQueryClient } from "../queryClient";

const loadGetQueryClient = async (
  isServer: boolean,
): Promise<typeof GetQueryClient> => {
  let getQueryClient: typeof GetQueryClient | undefined;
  await jest.isolateModulesAsync(async () => {
    jest.doMock("@tanstack/react-query", () => ({
      ...jest.requireActual("@tanstack/react-query"),
      isServer,
    }));
    ({ getQueryClient } = await import("../queryClient"));
  });
  return getQueryClient!;
};

describe("getQueryClient", () => {
  it("creates a new client per server call", async () => {
    const getQueryClient = await loadGetQueryClient(true);

    expect(getQueryClient()).not.toBe(getQueryClient());
  });

  it("reuses one client in the browser", async () => {
    const getQueryClient = await loadGetQueryClient(false);

    expect(getQueryClient()).toBe(getQueryClient());
  });
});
