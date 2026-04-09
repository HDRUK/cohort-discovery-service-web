/**
 * Admin – Networks tab.
 */
import { routes } from "@/config/routes";

describe("Admin – Networks", () => {
  beforeEach(() => {
    cy.login("admin", { isAdmin: true });
    cy.visit(routes.adminNetworks);
    cy.contains("Internal Server Error").should("not.exist");
  });

  it("renders the networks tab without errors", () => {
    cy.contains(/network/i, { timeout: 10000 }).should("be.visible");
  });

  it("lists networks returned by the API", () => {
    cy.contains("Test Network", { timeout: 15000 }).should("be.visible");
  });

  it("shows a create network button", () => {
    cy.contains(/create|new.*network|add.*network/i, { timeout: 10000 }).should("be.visible");
  });
});
