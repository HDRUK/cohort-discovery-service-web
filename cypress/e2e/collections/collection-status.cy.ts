/**
 * Collection status transitions – change status via dropdown/button.
 */
import { routes } from "@/config/routes";

describe("Collection status", () => {
  beforeEach(() => {
    cy.login("admin", { isAdmin: true });
    cy.visit(routes.adminCollections);
    cy.contains("Collections", { timeout: 10000 }).should("be.visible");
  });

  it("shows status chips or badges in the collection list", () => {
    cy.contains(/draft|active|pending|suspended/i, { timeout: 15000 }).should(
      "be.visible",
    );
  });

  it("shows the collection list after data loads", () => {
    cy.contains("Test Dataset Alpha", { timeout: 15000 }).should("be.visible");
  });
});
