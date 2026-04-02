/**
 * Logout flow – the /api/auth/logout Next.js route clears the token cookie
 * and redirects to /login.
 */
describe("Logout", () => {
  beforeEach(() => {
    cy.login();
    cy.setCookie("queryBuilderGuidanceRead", "true");
    // Land on an authenticated page first to confirm we are logged in
    cy.visit("/dashboard/new-query");
    cy.url().should("include", "/dashboard");
  });

  it("clears the auth cookie and redirects to login", () => {
    cy.visit("/api/auth/logout");
    cy.url({ timeout: 10000 }).should("include", "/login");
    cy.getCookie("token").should("be.null");
  });

  it("prevents access to dashboard after logout", () => {
    cy.visit("/api/auth/logout");
    cy.url({ timeout: 10000 }).should("include", "/login");
    cy.visit("/dashboard/new-query");
    cy.url({ timeout: 10000 }).should("include", "/login");
  });
});
