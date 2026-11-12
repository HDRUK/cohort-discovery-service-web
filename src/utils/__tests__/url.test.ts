import { isExternalHref } from "@/utils/url";

describe("isExternalHref", () => {
  it.each(["https://web.example.org/account/profile", "http://localhost:8100"])(
    "treats %s as external",
    (href) => {
      expect(isExternalHref(href)).toBe(true);
    },
  );

  it.each(["/dashboard/new-query", "/api/auth/logout", "profile"])(
    "treats %s as in-app",
    (href) => {
      expect(isExternalHref(href)).toBe(false);
    },
  );
});
