import { notFound, redirect } from "next/navigation";
import { apiGet, apiPost, ErrorMode, isSessionEnded } from "../api";

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
  redirect: jest.fn(() => {
    throw new Error("NEXT_REDIRECT");
  }),
}));

const respondWith = (status: number, body: unknown) =>
  jest.fn().mockResolvedValue({
    ok: status < 400,
    status,
    statusText: "",
    json: async () => body,
  });

let fetchMock: jest.Mock;

beforeEach(() => {
  fetchMock = respondWith(200, { message: "", data: [] });
  global.fetch = fetchMock;
  jest.spyOn(console, "error").mockImplementation(() => {});
});

const lastInit = () => fetchMock.mock.calls[0][1];

describe("request", () => {
  it("sends the bearer token", async () => {
    await apiGet("a-token", "/api/v1/user");

    expect(lastInit().headers.Authorization).toBe("Bearer a-token");
  });

  it("sends no Authorization header without a token", async () => {
    await apiPost(null, "/api/auth/login", { email: "user@example.com" });

    expect(lastInit().headers.Authorization).toBeUndefined();
  });

  it("never caches", async () => {
    await apiGet("a-token", "/api/v1/user");

    expect(lastInit().cache).toBe("no-store");
  });

  it("canonicalises the query string", async () => {
    await apiGet("a-token", "/api/v1/queries", { params: "b=2&a=1" });

    expect(fetchMock.mock.calls[0][0]).toMatch(/\/api\/v1\/queries\?a=1&b=2$/);
  });

  it("rejects an absolute path", async () => {
    await expect(
      apiGet("a-token", "https://attacker.example.com"),
    ).rejects.toThrow("API path must be relative");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("calls notFound on a 404", async () => {
    global.fetch = respondWith(404, { message: "Missing" });

    await expect(apiGet("a-token", "/api/v1/query/x")).rejects.toThrow(
      "NEXT_NOT_FOUND",
    );
    expect(notFound).toHaveBeenCalled();
  });

  it("redirects to /403 on a 403", async () => {
    global.fetch = respondWith(403, { message: "Forbidden" });

    await expect(apiGet("a-token", "/api/v1/query/x")).rejects.toThrow(
      "NEXT_REDIRECT",
    );
    expect(redirect).toHaveBeenCalledWith("/403");
  });

  it("redirects to logout on a 401", async () => {
    global.fetch = respondWith(401, { message: "Unauthenticated" });

    await expect(apiGet("a-token", "/api/v1/user")).rejects.toThrow(
      "NEXT_REDIRECT",
    );
    expect(redirect).toHaveBeenCalledWith("/api/auth/logout");
  });

  it("throws a token-less 401 so a failed sign-in can handle it", async () => {
    global.fetch = respondWith(401, { message: "Invalid credentials" });

    await expect(
      apiPost(null, "/api/auth/login", { email: "user@example.com" }),
    ).rejects.toMatchObject({ status: 401 });
    expect(redirect).not.toHaveBeenCalled();
  });

  it("rethrows an aborted fetch unchanged instead of reporting a 500", async () => {
    const aborted = new DOMException(
      "This operation was aborted",
      "AbortError",
    );
    global.fetch = jest.fn().mockRejectedValue(aborted);

    await expect(apiGet("a-token", "/api/v1/queries")).rejects.toBe(aborted);
  });

  it("reports any other failure as a 500", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("socket hang up"));

    await expect(apiGet("a-token", "/api/v1/queries")).rejects.toMatchObject({
      status: 500,
      message: "socket hang up",
    });
  });

  it("returns the error as a result in RESULT mode", async () => {
    global.fetch = respondWith(401, { message: "Unauthenticated" });

    await expect(
      apiGet("a-token", "/api/v1/user", { errorMode: ErrorMode.RESULT }),
    ).resolves.toEqual({
      data: null,
      error: { text: "Unauthenticated", code: 401 },
    });
  });
});

describe("isSessionEnded", () => {
  it("treats 401 as ended", () => {
    expect(isSessionEnded(401)).toBe(true);
  });

  it.each([403, 404])("treats %i as not ended", (status) => {
    expect(isSessionEnded(status)).toBe(false);
  });
});
