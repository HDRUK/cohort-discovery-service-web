/**
 * Admin – Collections tab.
 */
import { routes } from "@/config/routes";

describe("Admin – Collections", () => {
  beforeEach(() => {
    cy.login("admin", { isAdmin: true });
    cy.visit(routes.adminCollections);
    // Wait for the client component to mount and populate the Zustand store
    cy.contains("Collections", { timeout: 10000 }).should("be.visible");
  });

  it("renders the admin collections tab without errors", () => {
    cy.contains("Internal Server Error").should("not.exist");
  });

  it("displays collections from the admin API endpoint", () => {
    cy.contains("Test Dataset Alpha", { timeout: 15000 }).should("be.visible");
  });

  it("displays the second collection", () => {
    cy.contains("Test Dataset Beta", { timeout: 15000 }).should("be.visible");
  });

  it("shows custodian names alongside collections", () => {
    cy.contains("Test Custodian", { timeout: 15000 }).should("be.visible");
  });
});
