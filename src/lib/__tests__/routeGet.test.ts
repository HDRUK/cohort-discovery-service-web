import { ApiError } from "@/lib/https";
import { routeGet } from "../routeGet";

const mockFetch = jest.fn();

beforeAll(() => {
  global.fetch = mockFetch;
});

const responseWith = (ok: boolean, status: number, body: unknown) => ({
  ok,
  status,
  json: async () => body,
  text: async () => String(body),
});

describe("routeGet", () => {
  it("returns the parsed body and never uses the browser cache", async () => {
    mockFetch.mockResolvedValueOnce(responseWith(true, 200, { data: 1 }));

    await expect(routeGet("/api/tasks/abc")).resolves.toEqual({ data: 1 });
    expect(mockFetch).toHaveBeenCalledWith("/api/tasks/abc", {
      cache: "no-store",
    });
  });

  it("throws an ApiError with the status on a failed response", async () => {
    mockFetch.mockResolvedValueOnce(responseWith(false, 403, "Forbidden"));

    const error = await routeGet("/api/tasks/abc").catch((e) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(403);
    expect(error.message).toBe("Forbidden");
  });
});
