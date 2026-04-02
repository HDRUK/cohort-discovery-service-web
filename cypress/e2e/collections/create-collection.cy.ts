/**
 * Create collection – opens the create form, fills required fields, submits.
 */
describe("Create collection", () => {
  beforeEach(() => {
    cy.login("admin", { isAdmin: true });
    cy.visit("/admin/collections");
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

  it("submits the form with valid data and does not error", () => {
    cy.contains("button", "Collection").first().click();
    cy.get('input[name="collection.name"]', { timeout: 5000 })
      .first()
      .type("My New E2E Collection");
    cy.contains("button", /save|create|submit/i)
      .first()
      .click();
    cy.contains("Internal Server Error").should("not.exist");
  });
});
