/**
 * Admin – Users tab.
 * User management is not yet implemented; the tab renders an UnderConstruction
 * notice instead of a real user list.
 */
import { routes } from "@/config/routes";

describe("Admin – Users", () => {
  beforeEach(() => {
    cy.login("admin", { isAdmin: true });
    cy.visit(routes.adminUsers);
  });

  it("renders the users tab without errors", () => {
    cy.contains("Internal Server Error").should("not.exist");
  });

  it("shows the under construction notice for user management", () => {
    cy.contains(/under construction/i, { timeout: 10000 }).should("be.visible");
  });

  it("shows the section unavailable message", () => {
    cy.contains(/isn.t available yet/i, { timeout: 10000 }).should(
      "be.visible",
    );
  });

  it("shows a go back button", () => {
    cy.contains(/go back/i, { timeout: 10000 }).should("be.visible");
  });
});
