/**
 * Error pages – 403, user-not-found, and 404.
 */
import { routes } from "@/config/routes";

describe("Error pages", () => {
  it("renders the 403 Forbidden page directly", () => {
    cy.visit("/403", { failOnStatusCode: false });
    cy.contains(/403|forbidden|access denied/i).should("be.visible");
  });

  it("renders the user-not-found page", () => {
    cy.visit("/user-not-found", { failOnStatusCode: false });
    cy.contains(/user does not exist|user not found|not found/i).should("be.visible");
  });

  it("renders a 404 for an entirely unknown route", () => {
    cy.visit("/this-page-does-not-exist", { failOnStatusCode: false });
    cy.contains(/404|not found/i).should("be.visible");
  });

  it("redirects unauthenticated access to protected routes to login", () => {
    cy.clearCookie("token");
    cy.visit(routes.dashboard);
    cy.url({ timeout: 10000 }).should("include", "/login");
  });
});
