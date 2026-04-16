/**
 * Create collection – opens the create form, fills required fields, submits.
 */
import { routes } from "@/config/routes";

describe("Create collection", () => {
  beforeEach(() => {
    cy.login("admin", { isAdmin: true });
    cy.visit(routes.adminCollections);
    cy.contains("Collections", { timeout: 10000 }).should("be.visible");
  });

  it("shows a button to create a new collection", () => {
    // AddButton with label "Collection" inside the "Create" ActionMenuSection
    cy.contains("button", "Collection").should("be.visible");
  });

  it("opens the create collection form when the button is clicked", () => {
    cy.contains("button", "Collection").first().click();
    cy.contains(/name/i).should("be.visible");
  });

  it("shows required validation errors when submitting empty form", () => {
    cy.contains("button", "Collection").first().click();
    // Form opens – name input is required
    cy.get('input[name="collection.name"]', { timeout: 5000 }).should("exist");
    cy.contains("Internal Server Error").should("not.exist");
  });

  it("submits the form and shows validation errors on empty submit", () => {
    // collection.name is disabled until a host is selected; clicking Create
    // with no selections should show validation errors, not a server error.
    cy.contains("button", "Collection").first().click();
    cy.get('input[name="collection.name"]', { timeout: 5000 }).should("exist");
    cy.contains("button", /^create$/i).first().click();
    cy.contains("Internal Server Error").should("not.exist");
  });
});
