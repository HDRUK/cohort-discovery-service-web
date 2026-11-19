import { apiGet } from "@/server/api";
import { User } from "@/types/api";
import { getCurrentUser, toCurrentUser } from "../user";

jest.mock("@/server/api", () => ({
  apiGet: jest.fn(),
  ErrorMode: { THROW: "throw", RESULT: "result" },
}));

jest.mock("@/server/session", () => ({
  requireSession: jest.fn().mockResolvedValue({ token: "a-token" }),
}));

jest.mock("next/navigation", () => ({
  unstable_rethrow: jest.fn(),
}));

const mockedApiGet = apiGet as jest.MockedFunction<typeof apiGet>;

const makeUser = (overrides: Partial<User> = {}): User => ({
  id: 7,
  email: "user@example.com",
  name: "Jane Doe",
  email_verified_at: null,
  roles: [],
  custodians: [],
  query_quota: {} as User["query_quota"],
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-02T00:00:00Z",
  ...overrides,
});

beforeEach(() => mockedApiGet.mockReset());

describe("toCurrentUser", () => {
  it("drops fields the UI doesn't read", () => {
    const apiUser = { ...makeUser(), password_hint: "x", api_token: "y" };

    const current = toCurrentUser(apiUser);

    expect(current).not.toHaveProperty("password_hint");
    expect(current).not.toHaveProperty("api_token");
  });

  it("keeps the fields the UI reads", () => {
    const user = makeUser({ new_user_status: 1 });

    expect(toCurrentUser(user)).toMatchObject(user);
  });
});

describe("getCurrentUser", () => {
  it("returns the user on success", async () => {
    const user = makeUser();
    mockedApiGet.mockResolvedValueOnce({ message: "", data: user } as never);

    const result = await getCurrentUser();

    expect(result.data).toEqual(user);
    expect(mockedApiGet).toHaveBeenCalledTimes(1);
  });

  it("returns the API error as a result after a failure", async () => {
    const notFound = { data: null, error: { text: "Missing", code: 404 } };
    mockedApiGet.mockResolvedValue(notFound as never);

    const result = await getCurrentUser();

    expect(result).toEqual(notFound);
    expect(mockedApiGet).toHaveBeenCalledTimes(2);
    expect(mockedApiGet).toHaveBeenLastCalledWith("a-token", "/api/v1/user", {
      errorMode: "result",
    });
  });
});
