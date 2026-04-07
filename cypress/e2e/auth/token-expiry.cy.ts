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
      // Use cy.request with followRedirect:false to capture only the first redirect.
      // The protected layout detects the expired token and issues a 3xx redirect
      // toward the logout/login flow. Avoid cy.visit() which can loop when the
      // Cypress cookie jar doesn't honour the logout Set-Cookie during redirect.
      cy.request({
        url: "/dashboard/new-query",
        followRedirect: false,
        failOnStatusCode: false,
      }).then((resp) => {
        expect(resp.status).to.be.oneOf([301, 302, 307, 308]);
        const location = resp.headers["location"] as string;
        expect(location).to.match(/logout|login/i);
      });
    });
  });

  it("redirects unauthenticated access to /admin back to /login", () => {
    cy.clearCookie("token");
    cy.visit("/admin/workgroups");
    cy.url({ timeout: 10000 }).should("include", "/login");
  });
});
