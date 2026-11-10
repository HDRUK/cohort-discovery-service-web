/**
 * @jest-environment node
 */
import { getSession } from "@/server/session";
import { badRequest, toResponse, withSession } from "../routeHandler";

jest.mock("@/server/session", () => ({
  getSession: jest.fn(),
}));

const mockedGetSession = getSession as jest.MockedFunction<typeof getSession>;

const SESSION = {
  token: "a-token",
  user: { id: 1, name: "Jane Doe", email: "user@example.com" },
} as Awaited<ReturnType<typeof getSession>>;

const ok = { message: "", data: { pid: "abc" } };

describe("toResponse", () => {
  it("sends a successful result as uncached JSON", async () => {
    const response = toResponse(ok);

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(await response.json()).toEqual(ok);
  });

  it.each([403, 404, 422])("passes an API %i through", async (code) => {
    const response = toResponse({
      message: "",
      data: null,
      error: { text: "Nope", code },
    });

    expect(response.status).toBe(code);
    expect(await response.text()).toBe("Nope");
  });
});

describe("toResponse with a server error", () => {
  it.each([500, 503])(
    "replaces the API's text with a generic message for a %i",
    async (code) => {
      const response = toResponse({
        message: "",
        data: null,
        error: { text: "SQLSTATE[42S22]: Column not found", code },
      });

      expect(response.status).toBe(code);
      expect(await response.text()).toBe(
        "Something went wrong. Try again later.",
      );
    },
  );
});

describe("badRequest", () => {
  it("returns a 400 with the reason", async () => {
    const response = badRequest("Invalid pid");

    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Invalid pid");
  });
});

describe("withSession", () => {
  it("returns 401 without reading when there is no session", async () => {
    mockedGetSession.mockResolvedValueOnce(null);
    const read = jest.fn();

    const response = await withSession(read);

    expect(response.status).toBe(401);
    expect(read).not.toHaveBeenCalled();
  });

  it("turns the read result into a response", async () => {
    mockedGetSession.mockResolvedValueOnce(SESSION);

    const response = await withSession(async () => ok);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(ok);
  });

  it("returns a response the read built itself", async () => {
    mockedGetSession.mockResolvedValueOnce(SESSION);

    const response = await withSession(async () => badRequest("Invalid"));

    expect(response.status).toBe(400);
  });
});
