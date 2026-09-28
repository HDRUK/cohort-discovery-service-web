import { cookies, headers } from "next/headers";
import jwt from "jsonwebtoken";
import { setAuthCookie } from "../setAuthCookie";
import { ACCESS_TOKEN_NAME } from "@/config/internals";

jest.mock("next/headers");

const mockCookies = cookies as jest.MockedFunction<typeof cookies>;
const mockHeaders = headers as jest.MockedFunction<typeof headers>;

describe("setAuthCookie", () => {
  let mockCookieSet: jest.Mock;
  let mockHeadersGet: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCookieSet = jest.fn();
    mockHeadersGet = jest.fn();

    mockCookies.mockResolvedValue({
      set: mockCookieSet,
    } as Record<string, unknown>);

    mockHeaders.mockResolvedValue({
      get: mockHeadersGet,
    } as Record<string, unknown>);
  });

  it("returns false when token cannot be decoded", async () => {
    const result = await setAuthCookie("not-a-jwt");
    expect(result).toBe(false);
  });

  it("returns false when token is empty", async () => {
    const result = await setAuthCookie("");
    expect(result).toBe(false);
  });

  it("sets cookie with correct maxAge when token is valid", async () => {
    const now = Math.floor(Date.now() / 1000);
    const exp = now + 3600;
    const token = jwt.sign({ exp }, "secret");

    mockHeadersGet.mockReturnValue(String(now));

    const result = await setAuthCookie(token);

    expect(result).toBe(true);
    expect(mockCookieSet).toHaveBeenCalledWith(
      ACCESS_TOKEN_NAME,
      token,
      expect.objectContaining({
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      }),
    );
  });

  it("applies 30 second skew to maxAge calculation", async () => {
    const now = Math.floor(Date.now() / 1000);
    const exp = now + 3600;
    const token = jwt.sign({ exp }, "secret");

    mockHeadersGet.mockReturnValue(String(now));

    await setAuthCookie(token);

    const callArgs = mockCookieSet.mock.calls[0];
    const maxAge = callArgs[2].maxAge;

    expect(maxAge).toBe(3600 - 30);
  });

  it("uses production secure flag when NODE_ENV is production", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    const now = Math.floor(Date.now() / 1000);
    const exp = now + 3600;
    const token = jwt.sign({ exp }, "secret");

    mockHeadersGet.mockReturnValue(String(now));

    await setAuthCookie(token);

    expect(mockCookieSet).toHaveBeenCalledWith(
      ACCESS_TOKEN_NAME,
      token,
      expect.objectContaining({
        secure: true,
      }),
    );

    process.env.NODE_ENV = originalEnv;
  });

  it("defaults to 1 hour maxAge when exp is missing", async () => {
    const token = jwt.sign({}, "secret");
    mockHeadersGet.mockReturnValue("0");

    await setAuthCookie(token);

    expect(mockCookieSet).toHaveBeenCalledWith(
      ACCESS_TOKEN_NAME,
      token,
      expect.objectContaining({
        maxAge: 60 * 60,
      }),
    );
  });

  it("clamps negative maxAge to 0", async () => {
    const now = Math.floor(Date.now() / 1000);
    const exp = now - 100;
    const token = jwt.sign({ exp }, "secret");

    mockHeadersGet.mockReturnValue(String(now));

    await setAuthCookie(token);

    expect(mockCookieSet).toHaveBeenCalledWith(
      ACCESS_TOKEN_NAME,
      token,
      expect.objectContaining({
        maxAge: 0,
      }),
    );
  });
});
