/**
 * OIDC login flow.
 * Requires OIDC_ENABLED=true, the OIDC mock server on localhost:4011,
 * and NEXTAUTH_SECRET set so next-auth can validate the session cookie.
 */
import { routes } from "@/config/routes";

const oidcEnabled =
  Cypress.env("OIDC_ENABLED") === true ||
  Cypress.env("OIDC_ENABLED") === "true";

(oidcEnabled ? describe : describe.skip)("OIDC Login", () => {
  beforeEach(() => {
    cy.clearCookies();
  });

  it("renders the OIDC sign-in button on the login page", () => {
    cy.visit("/login");
    cy.contains("button", "Sign in with Lifescience Login").should("be.visible");
  });

  it("redirects unauthenticated users to the OIDC sign-in endpoint from protected pages", () => {
    cy.visit(routes.dashboardNewQuery());
    cy.url({ timeout: 15000 }).should("include", "/auth/signin/oidc");
  });

  it("completes OIDC login and lands on the dashboard", () => {
    cy.visit("/login");
    cy.contains("button", "Sign in with Lifescience Login").should("be.visible").click();
    // next-auth renders an intermediary sign-in page; submit it to start the
    // OAuth redirect to the mock OIDC server on localhost:4011.
    cy.url({ timeout: 10000 }).should("include", "/auth/signin/oidc");
    cy.contains("button", "Sign in with Lifescience Login").should("be.visible").click();

    cy.origin("http://localhost:4011", () => {
      cy.get('input[name="Input.Username"]', { timeout: 15000 }).should("be.visible");
      cy.get('input[name="Input.Username"]').type("Researcher");
      cy.get('input[name="Input.Password"]').type("researcher");
      cy.get('button[name="Input.Button"][value="login"]').click();
    });

    cy.url({ timeout: 30000 }).should("include", "/dashboard");
    cy.getCookie("next-auth.session-token").should("exist");
  });

  it("redirects to the dashboard when visiting login while already authenticated", () => {
    cy.loginOidc();
    cy.visit("/login");
    cy.url({ timeout: 15000 }).should("include", "/dashboard");
  });

  it("allows dashboard access after seeding an OIDC session", () => {
    cy.loginOidc();
    cy.visit(routes.dashboardNewQuery());
    cy.url({ timeout: 15000 }).should("include", "/dashboard");
  });

  it("logs out, clears the session, and requires OIDC sign-in again", () => {
    cy.loginOidc();
    cy.visit(routes.dashboardNewQuery());
    cy.url({ timeout: 15000 }).should("include", "/dashboard");

    // Verify the logout route clears the session and redirects to the OIDC
    // end-session endpoint, which ultimately sends the browser back to /login.
    cy.request({
      url: "/auth/logout",
      followRedirect: false,
    }).then((resp) => {
      expect(resp.status).to.be.oneOf([301, 302, 307, 308]);
      const location = resp.headers["location"] as string;
      expect(location).to.include("localhost:4011");
      expect(location).to.include("post_logout_redirect_uri=");
    });

    cy.clearCookie("next-auth.session-token");
    cy.getCookie("next-auth.session-token").should("be.null");

    // After logout the protected layout should redirect back to OIDC sign-in.
    cy.visit(routes.dashboardNewQuery());
    cy.url({ timeout: 15000 }).should("include", "/auth/signin/oidc");
  });
});
