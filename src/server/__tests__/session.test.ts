import jwt from "jsonwebtoken";
import { decodeSession } from "../session";

const USER = { id: 7, name: "Jane Doe", email: "user@example.com" };

describe("decodeSession", () => {
  it("returns null without a token", () => {
    expect(decodeSession(undefined)).toBeNull();
  });

  it("returns null for an undecodable token", () => {
    expect(decodeSession("not-a-jwt")).toBeNull();
  });

  it("returns null for a token without a user", () => {
    expect(decodeSession(jwt.sign({ sub: "7" }, "test-secret"))).toBeNull();
  });

  it("returns the token, user and expiry", () => {
    const token = jwt.sign({ user: USER, exp: 2_000_000_000 }, "test-secret");

    expect(decodeSession(token)).toEqual({
      token,
      user: USER,
      exp: 2_000_000_000,
    });
  });
});
