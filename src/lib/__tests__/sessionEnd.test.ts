import { ApiError } from "@/lib/https";
import { endSessionIfUnauthorised } from "@/lib/sessionEnd";
import { useSessionStore } from "@/store/sessionStore";

beforeEach(() => useSessionStore.setState({ hasEnded: false }));

describe("endSessionIfUnauthorised", () => {
  it("ends the session for an API 401", () => {
    expect(endSessionIfUnauthorised(new ApiError(401, "Unauthenticated"))).toBe(
      true,
    );
    expect(useSessionStore.getState().hasEnded).toBe(true);
  });

  it.each([
    ["an API 500", new ApiError(500, "Server error")],
    ["a plain error", new Error("401")],
  ])("leaves the session for %s", (_, error) => {
    expect(endSessionIfUnauthorised(error)).toBe(false);
    expect(useSessionStore.getState().hasEnded).toBe(false);
  });
});
