/**
 * Expired / missing token handling.
 * Running with APPLICATION_MODE=standalone → unauthenticated requests
 * redirect to /login.
 */
describe("Token expiry", () => {
  it("redirects to /login when no token is present", () => {
    cy.clearCookie("token");
    cy.visit("/dashboard/new-query");
    cy.url({ timeout: 10000 }).should("include", "/login");
  });

  it("redirects to /login with an expired token (standalone mode)", () => {
    cy.task("generateExpiredToken").then((token) => {
      cy.setCookie("token", token as string, {
        domain: "localhost",
        path: "/",
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });
      cy.visit("/dashboard/new-query");
      cy.url({ timeout: 10000 }).should("include", "/login");
    });
  });

  it("redirects unauthenticated access to /admin back to /login", () => {
    cy.clearCookie("token");
    cy.visit("/admin/workgroups");
    cy.url({ timeout: 10000 }).should("include", "/login");
  });
});
