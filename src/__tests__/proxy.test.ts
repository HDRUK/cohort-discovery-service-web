/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_NAME } from "@/config/internals";
import { proxy } from "@/proxy";

const NOW_MS = 1_700_000_000_500;

const validToken = () =>
  jwt.sign({ user: { id: 1 }, exp: NOW_MS / 1000 + 60 }, "test-secret");

const requestFor = (url: string, token?: string) =>
  new NextRequest(url, {
    headers: token ? { cookie: `${ACCESS_TOKEN_NAME}=${token}` } : {},
  });

const forwardedHeader = (response: Response, name: string) =>
  response.headers.get(`x-middleware-request-${name}`);

describe("proxy", () => {
  beforeEach(() => {
    jest.spyOn(Date, "now").mockReturnValue(NOW_MS);
    process.env.APPLICATION_MODE = "standalone";
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete process.env.APPLICATION_MODE;
  });

  it("forwards x-request-now on the request", async () => {
    const response = await proxy(
      requestFor("https://localhost/admin", validToken()),
    );

    expect(forwardedHeader(response, "x-request-now")).toBe("1700000000");
    expect(response.headers.get("x-request-now")).toBeNull();
  });

  it("forwards x-pathname with the query string", async () => {
    const response = await proxy(
      requestFor(
        "https://localhost/term-directory?tab=conditions",
        validToken(),
      ),
    );

    expect(forwardedHeader(response, "x-pathname")).toBe(
      "/term-directory?tab=conditions",
    );
  });

  it("redirects a logged-out request to login on the request's own host", async () => {
    const response = await proxy(
      requestFor("https://localhost/admin/collections"),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://localhost/login?return_to=%2Fadmin%2Fcollections",
    );
  });
});
