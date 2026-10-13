import { safeReturnTo } from "../returnTo";
import { routes } from "@/config/routes";

describe("safeReturnTo", () => {
  it("keeps a same-origin path", () => {
    expect(safeReturnTo("/dashboard/new-query")).toBe("/dashboard/new-query");
  });

  it("keeps a path with a query string", () => {
    expect(safeReturnTo("/admin/users?page=2")).toBe("/admin/users?page=2");
  });

  it("rejects a protocol-relative url", () => {
    expect(safeReturnTo("//evil.example")).toBe(routes.home);
  });

  it("rejects an absolute url", () => {
    expect(safeReturnTo("https://evil.example/steal")).toBe(routes.home);
  });

  it("rejects a backslash-escaped host", () => {
    expect(safeReturnTo("/\\evil.example")).toBe(routes.home);
  });

  it("rejects a scheme smuggled into the first segment", () => {
    expect(safeReturnTo("/javascript:alert(1)")).toBe(routes.home);
  });

  it("falls back when nothing was supplied", () => {
    expect(safeReturnTo(undefined)).toBe(routes.home);
    expect(safeReturnTo(null)).toBe(routes.home);
    expect(safeReturnTo("")).toBe(routes.home);
  });
});
