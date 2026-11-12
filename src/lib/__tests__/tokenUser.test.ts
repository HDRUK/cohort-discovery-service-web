import { toClientTokenUser } from "@/lib/tokenUser";
import { TokenUser } from "@/types/api";

const tokenUser = (rest: Partial<TokenUser> = {}): TokenUser =>
  ({
    id: 1,
    email: "jane.doe@example.com",
    orcid: "0000-0000-0000-0000",
    name: "Jane Doe",
    is_admin: true,
    sso_provider: "keycloak",
    sso_logout_ticket: "a-logout-ticket",
    cohort_admin_teams: [],
    ...rest,
  }) as TokenUser;

describe("toClientTokenUser", () => {
  it("keeps the fields the browser reads", () => {
    expect(toClientTokenUser(tokenUser())).toEqual({
      sso_provider: "keycloak",
      orcid: "0000-0000-0000-0000",
      is_admin: true,
      cohort_admin_teams: [],
    });
  });

  it("drops the logout ticket and personal details", () => {
    const clientUser = toClientTokenUser(tokenUser());

    expect(clientUser).not.toHaveProperty("sso_logout_ticket");
    expect(clientUser).not.toHaveProperty("email");
    expect(clientUser).not.toHaveProperty("name");
  });
});
