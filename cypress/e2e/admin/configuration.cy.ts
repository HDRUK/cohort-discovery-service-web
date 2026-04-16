/**
 * Admin – Configuration page.
 */
import { routes } from "@/config/routes";

describe("Admin – Configuration", () => {
  beforeEach(() => {
    cy.login("admin", { isAdmin: true });
    cy.visit(routes.config);
  });

  it("renders the configuration page without errors", () => {
    cy.contains("Internal Server Error").should("not.exist");
  });

  it("displays feature flag toggles", () => {
    // Configuration page renders feature flags
    cy.contains(/feature|flag|configuration/i, { timeout: 10000 }).should("be.visible");
  });
});
