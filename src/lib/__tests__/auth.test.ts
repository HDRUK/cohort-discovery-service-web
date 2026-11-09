import { redirect } from "next/navigation";
import { requireSession } from "../auth";

jest.mock("next/navigation", () => ({
  redirect: jest.fn(() => {
    throw new Error("NEXT_REDIRECT");
  }),
}));

describe("requireSession", () => {
  it("throws a redirect without a token", () => {
    expect(() => requireSession(undefined)).toThrow("NEXT_REDIRECT");
    expect(redirect).toHaveBeenCalled();
  });

  it("returns when a token is present", () => {
    expect(() => requireSession("a-token")).not.toThrow();
    expect(redirect).not.toHaveBeenCalled();
  });
});
