import { routes } from "@/config/routes";

describe("Admin – Users", () => {
  beforeEach(() => {
    cy.login("admin", { isAdmin: true });
    cy.visit(routes.adminUsers);
  });

  it("renders the users tab without errors", () => {
    cy.contains("Internal Server Error").should("not.exist");
  });

  it("shows the users management title", () => {
    cy.contains(/users/i, { timeout: 10000 }).should("be.visible");
    cy.contains(/management/i, { timeout: 10000 }).should("be.visible");
  });

  it("offers a search box for finding users", () => {
    cy.get('input[placeholder*="Search by name or email"]', {
      timeout: 10000,
    }).should("be.visible");
  });
});
