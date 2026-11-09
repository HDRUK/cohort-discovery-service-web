import { User } from "@/types/api";
import { toCurrentUser } from "../user";

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
