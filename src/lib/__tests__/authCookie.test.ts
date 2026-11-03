import { cookies, headers } from "next/headers";
import jwt from "jsonwebtoken";
import { getAccessTokenMaxAge, setAccessTokenCookie } from "../authCookie";
import { ACCESS_TOKEN_NAME } from "@/config/internals";

jest.mock("next/headers");

const mockCookies = cookies as jest.MockedFunction<typeof cookies>;
const mockHeaders = headers as jest.MockedFunction<typeof headers>;

const NOW = 1_760_000_000;
const AN_HOUR = 60 * 60;

const signToken = (payload: Record<string, unknown>) =>
  jwt.sign(payload, "test-secret");

describe("getAccessTokenMaxAge", () => {
  it("subtracts the clock skew from the remaining lifetime", () => {
    expect(getAccessTokenMaxAge(NOW + AN_HOUR, NOW)).toBe(AN_HOUR - 30);
  });

  it("falls back to an hour when the token carries no expiry", () => {
    expect(getAccessTokenMaxAge(undefined, NOW)).toBe(AN_HOUR);
  });

  it("clamps an already-expired token to zero", () => {
    expect(getAccessTokenMaxAge(NOW - 100, NOW)).toBe(0);
  });
});

describe("setAccessTokenCookie", () => {
  let cookieSet: jest.Mock;
  let headerGet: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    cookieSet = jest.fn();
    headerGet = jest.fn().mockReturnValue(String(NOW));

    mockCookies.mockResolvedValue({
      set: cookieSet,
    } as unknown as Awaited<ReturnType<typeof cookies>>);

    mockHeaders.mockResolvedValue({
      get: headerGet,
    } as unknown as Awaited<ReturnType<typeof headers>>);
  });

  it("returns false without setting a cookie when the token cannot be decoded", async () => {
    await expect(setAccessTokenCookie("not-a-jwt")).resolves.toBe(false);
    expect(cookieSet).not.toHaveBeenCalled();
  });

  it("returns false when the token is empty", async () => {
    await expect(setAccessTokenCookie("")).resolves.toBe(false);
    expect(cookieSet).not.toHaveBeenCalled();
  });

  it("stores the token as an httpOnly cookie scoped to the whole site", async () => {
    const token = signToken({ exp: NOW + AN_HOUR });

    await expect(setAccessTokenCookie(token)).resolves.toBe(true);
    expect(cookieSet).toHaveBeenCalledWith(
      ACCESS_TOKEN_NAME,
      token,
      expect.objectContaining({ httpOnly: true, sameSite: "lax", path: "/" }),
    );
  });

  it("derives maxAge from the request clock supplied by the proxy", async () => {
    await setAccessTokenCookie(signToken({ exp: NOW + AN_HOUR }));

    expect(cookieSet.mock.calls[0][2].maxAge).toBe(AN_HOUR - 30);
  });

  it("falls back to the server clock when the proxy header is absent", async () => {
    headerGet.mockReturnValue(null);
    const exp = Math.floor(Date.now() / 1000) + AN_HOUR;

    await setAccessTokenCookie(signToken({ exp }));

    expect(cookieSet.mock.calls[0][2].maxAge).toBeLessThanOrEqual(AN_HOUR - 30);
    expect(cookieSet.mock.calls[0][2].maxAge).toBeGreaterThan(AN_HOUR - 60);
  });

  it("falls back to the server clock when the proxy header is unparseable", async () => {
    headerGet.mockReturnValue("not-a-number");
    const exp = Math.floor(Date.now() / 1000) + AN_HOUR;

    await setAccessTokenCookie(signToken({ exp }));

    expect(cookieSet.mock.calls[0][2].maxAge).toBeLessThanOrEqual(AN_HOUR - 30);
    expect(cookieSet.mock.calls[0][2].maxAge).toBeGreaterThan(AN_HOUR - 60);
  });
});
