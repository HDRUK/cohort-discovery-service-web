/**
 * @jest-environment node
 */
import { SessionAccess } from "@/app/(protected)/components/sessionAccess";
import { getUserCollections } from "@/server/data/collections";
import { getCustodians } from "@/server/data/custodians";
import { getFeatureFlags } from "@/server/data/features";
import { getCurrentUser } from "@/server/data/user";
import { getWorkgroups } from "@/server/data/workgroups";
import { getSession } from "@/server/session";
import { loadSession } from "../loadSession";

jest.mock("@/server/session", () => ({ getSession: jest.fn() }));
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
const TOKEN_USER = { id: 1, name: "Jane Doe" };

const resolveSessionReads = () => {
  mocked(getFeatureFlags).mockResolvedValue(ok({ flag: true }));
  mocked(getCustodians).mockResolvedValue(ok([]));
  mocked(getWorkgroups).mockResolvedValue(ok([]));
  mocked(getUserCollections).mockResolvedValue(ok([{ pid: "c1" }]));
};

describe("loadSession", () => {
  beforeEach(() => {
    mocked(getSession).mockResolvedValue({ token: "t", user: TOKEN_USER });
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
      data: {
        user: { ...USER, token_user: TOKEN_USER },
        userCollections: [{ pid: "c1" }],
        custodians: [],
        workgroups: [],
      },
    });
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
