import { ApiResponse, User } from "@/types/api";
import { RoleName } from "@/types/roles";
import { decideAccess, SessionAccess } from "./sessionAccess";

const userWith = ({
  roles = [],
  custodians = 0,
}: {
  roles?: RoleName[];
  custodians?: number;
}): ApiResponse<User> => ({
  message: "",
  data: {
    roles: roles.map((name) => ({ name })),
    custodians: Array.from({ length: custodians }, (_, id) => ({ id })),
  } as unknown as User,
});

const errorWith = (code: number): ApiResponse<User> => ({
  message: "",
  data: null as unknown as User,
  error: { text: "Nope", code },
});

describe("decideAccess", () => {
  it("allows a user role", () => {
    expect(decideAccess(userWith({ roles: [RoleName.USER] }))).toBe(
      SessionAccess.Ok,
    );
  });

  it("allows an admin", () => {
    expect(decideAccess(userWith({ roles: [RoleName.ADMIN] }))).toBe(
      SessionAccess.Ok,
    );
  });

  it("allows a custodian member without a role", () => {
    expect(decideAccess(userWith({ custodians: 1 }))).toBe(SessionAccess.Ok);
  });

  it("forbids a user with no role or custodian", () => {
    expect(decideAccess(userWith({}))).toBe(SessionAccess.Forbidden);
  });

  it("reports user-not-found on 404", () => {
    expect(decideAccess(errorWith(404))).toBe(SessionAccess.UserNotFound);
  });

  it("reports an ended session on 401", () => {
    expect(decideAccess(errorWith(401))).toBe(SessionAccess.SessionEnded);
  });

  it("reports any other error as failed", () => {
    expect(decideAccess(errorWith(500))).toBe(SessionAccess.Failed);
  });
});
