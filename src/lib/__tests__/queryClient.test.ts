import type * as QueryClientModule from "../queryClient";
import type * as SessionStoreModule from "@/store/sessionStore";
import type * as HttpsModule from "@/lib/https";

type Modules = typeof QueryClientModule &
  typeof SessionStoreModule &
  typeof HttpsModule;

const loadModules = async (isServer: boolean): Promise<Modules> => {
  let modules: Modules | undefined;
  await jest.isolateModulesAsync(async () => {
    jest.doMock("@tanstack/react-query", () => ({
      ...jest.requireActual("@tanstack/react-query"),
      isServer,
    }));
    modules = {
      ...(await import("../queryClient")),
      ...(await import("@/store/sessionStore")),
      ...(await import("@/lib/https")),
    };
  });
  return modules!;
};

const failWith = (error: Error) => (): Promise<never> => Promise.reject(error);

describe("getQueryClient", () => {
  it("creates a new client per server call", async () => {
    const { getQueryClient } = await loadModules(true);

    expect(getQueryClient()).not.toBe(getQueryClient());
  });

  it("reuses one client in the browser", async () => {
    const { getQueryClient } = await loadModules(false);

    expect(getQueryClient()).toBe(getQueryClient());
  });

  it("ends the session once when two queries get a 401", async () => {
    const { getQueryClient, useSessionStore, ApiError } =
      await loadModules(false);
    const transitions = jest.fn();
    useSessionStore.subscribe((state, previous) => {
      if (state.hasEnded !== previous.hasEnded) transitions();
    });
    const client = getQueryClient();

    await Promise.allSettled(
      ["a", "b"].map((key) =>
        client.fetchQuery({
          queryKey: [key],
          queryFn: failWith(new ApiError(401, "Unauthenticated")),
          retry: false,
        }),
      ),
    );

    expect(useSessionStore.getState().hasEnded).toBe(true);
    expect(transitions).toHaveBeenCalledTimes(1);
  });

  it("keeps the session for other errors", async () => {
    const { getQueryClient, useSessionStore, ApiError } =
      await loadModules(false);

    await getQueryClient()
      .fetchQuery({
        queryKey: ["a"],
        queryFn: failWith(new ApiError(500, "Server error")),
        retry: false,
      })
      .catch(() => undefined);

    expect(useSessionStore.getState().hasEnded).toBe(false);
  });
});
