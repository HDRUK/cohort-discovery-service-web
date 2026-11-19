/**
 * @jest-environment node
 */
import { headers } from "next/headers";
import { SessionAccess } from "@/types/session";
import { getUserCollections } from "@/server/data/collections";
import { getCustodians } from "@/server/data/custodians";
import { getFeatureFlags } from "@/server/data/features";
import { getCurrentUser } from "@/server/data/user";
import { getWorkgroups } from "@/server/data/workgroups";
import { getSession, hasLiveSession } from "@/server/session";
import { loadSession, loadSessionDataOrSignedOut } from "../loadSession";

jest.mock("next/headers", () => ({ headers: jest.fn() }));
jest.mock("@/server/session", () => ({
  getSession: jest.fn(),
  hasLiveSession: jest.fn(),
}));
jest.mock("@/server/data/user", () => ({ getCurrentUser: jest.fn() }));
jest.mock("@/server/data/features", () => ({ getFeatureFlags: jest.fn() }));
jest.mock("@/server/data/custodians", () => ({ getCustodians: jest.fn() }));
jest.mock("@/server/data/workgroups", () => ({ getWorkgroups: jest.fn() }));
jest.mock("@/server/data/collections", () => ({
  getUserCollections: jest.fn(),
}));

const mocked = <T extends (...args: never[]) => unknown>(fn: T) =>
  fn as unknown as jest.Mock;

const ok = <T>(data: T) => ({ message: "", data });

const USER = { id: 1, roles: [{ name: "user" }], custodians: [] };
const TOKEN_USER = {
  id: 1,
  name: "Jane Doe",
  email: "jane.doe@example.com",
  sso_logout_ticket: "a-logout-ticket",
  is_admin: false,
};
const CLIENT_TOKEN_USER = { is_admin: false };
const REQUEST_NOW = 1_700_000_000;

const resolveSessionReads = () => {
  mocked(getFeatureFlags).mockResolvedValue(ok({ flag: true }));
  mocked(getCustodians).mockResolvedValue(ok([]));
  mocked(getWorkgroups).mockResolvedValue(ok([]));
  mocked(getUserCollections).mockResolvedValue(ok([{ pid: "c1" }]));
};

describe("loadSession", () => {
  beforeEach(() => {
    mocked(getSession).mockResolvedValue({ token: "t", user: TOKEN_USER });
    mocked(headers).mockResolvedValue(
      new Headers({ "x-request-now": String(REQUEST_NOW) }),
    );
  });

  it("starts the session reads before the user has loaded", async () => {
    let resolveUser: (value: unknown) => void = () => undefined;
    mocked(getCurrentUser).mockReturnValue(
      new Promise((resolve) => {
        resolveUser = resolve;
      }),
    );
    resolveSessionReads();

    const loading = loadSession();

    expect(getFeatureFlags).toHaveBeenCalled();
    expect(getUserCollections).toHaveBeenCalled();

    resolveUser(ok(USER));
    await expect(loading).resolves.toMatchObject({
      access: SessionAccess.Ok,
    });
  });

  it("returns the session data with the token user for a signed-in user", async () => {
    mocked(getCurrentUser).mockResolvedValue(ok(USER));
    resolveSessionReads();

    const loaded = await loadSession();

    expect(loaded).toEqual({
      access: SessionAccess.Ok,
      flags: { flag: true },
      sessionMsRemaining: null,
      data: {
        user: { ...USER, token_user: CLIENT_TOKEN_USER },
        userCollections: [{ pid: "c1" }],
        custodians: [],
        workgroups: [],
      },
    });
  });

  it("measures the time left on the token from the request time", async () => {
    mocked(getSession).mockResolvedValue({
      token: "t",
      user: TOKEN_USER,
      exp: REQUEST_NOW + 90,
    });
    mocked(getCurrentUser).mockResolvedValue(ok(USER));
    resolveSessionReads();

    const loaded = await loadSession();

    expect(loaded).toMatchObject({ sessionMsRemaining: 60_000 });
  });

  it("reports an ended session without waiting for or leaking the session reads", async () => {
    const unhandled = jest.fn();
    process.on("unhandledRejection", unhandled);
    mocked(getCurrentUser).mockResolvedValue({
      message: "",
      data: null,
      error: { text: "Unauthenticated", code: 401 },
    });
    [getFeatureFlags, getCustodians, getWorkgroups, getUserCollections].forEach(
      (read) => mocked(read).mockRejectedValue(new Error("NEXT_REDIRECT")),
    );

    const loaded = await loadSession();
    await new Promise((resolve) => setImmediate(resolve));
    process.off("unhandledRejection", unhandled);

    expect(loaded).toEqual({
      access: SessionAccess.SessionEnded,
      errorText: "Unauthenticated",
      data: null,
    });
    expect(unhandled).not.toHaveBeenCalled();
  });
});

describe("loadSessionDataOrSignedOut", () => {
  beforeEach(() => {
    mocked(getSession).mockResolvedValue({ token: "t", user: TOKEN_USER });
    mocked(hasLiveSession).mockResolvedValue(true);
  });

  it("returns the session data for a signed-in user", async () => {
    mocked(getCurrentUser).mockResolvedValue(ok(USER));
    resolveSessionReads();

    await expect(loadSessionDataOrSignedOut()).resolves.toMatchObject({
      user: { ...USER, token_user: CLIENT_TOKEN_USER },
    });
  });

  it("returns null without calling the API when there is no live session", async () => {
    mocked(hasLiveSession).mockResolvedValue(false);
    mocked(getCurrentUser).mockClear();

    await expect(loadSessionDataOrSignedOut()).resolves.toBeNull();
    expect(getCurrentUser).not.toHaveBeenCalled();
  });

  it("returns null when the API says the session has ended", async () => {
    mocked(getCurrentUser).mockResolvedValue({
      message: "",
      data: null,
      error: { text: "Unauthenticated", code: 401 },
    });
    resolveSessionReads();

    await expect(loadSessionDataOrSignedOut()).resolves.toBeNull();
  });

  it("returns null instead of rejecting when a session read redirects", async () => {
    mocked(getCurrentUser).mockResolvedValue(ok(USER));
    resolveSessionReads();
    mocked(getCustodians).mockRejectedValue(new Error("NEXT_REDIRECT"));

    await expect(loadSessionDataOrSignedOut()).resolves.toBeNull();
  });
});
