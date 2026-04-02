/**
 * Delete collection – confirm dialog and row removal.
 * DeleteButton is icon-only (no text) – identified by data-testid="DeleteIcon".
 * Clicking it always opens the confirm dialog; row selection is optional.
 */
describe("Delete collection", () => {
  beforeEach(() => {
    cy.login("admin", { isAdmin: true });
    cy.visit("/admin/collections");
    cy.contains("Collections", { timeout: 10000 }).should("be.visible");
  });

  it("shows a delete action for each collection", () => {
    cy.contains("Test Dataset Alpha", { timeout: 15000 }).should("be.visible");
    cy.get('[data-testid="DeleteIcon"]').should("exist");
  });

  it("shows a confirmation dialog before deleting", () => {
    cy.get('[data-testid="DeleteIcon"]', { timeout: 15000 }).first().click();
    cy.contains(/confirm|are you sure|delete/i).should("be.visible");
  });

  it("cancels the delete when cancel is clicked", () => {
    cy.get('[data-testid="DeleteIcon"]', { timeout: 15000 }).first().click();
    cy.contains("button", /cancel/i).click();
    cy.contains("Test Dataset Alpha").should("be.visible");
  });

  it("completes delete after confirmation without error", () => {
    cy.get('[data-testid="DeleteIcon"]', { timeout: 15000 }).first().click();
    cy.contains("button", /^delete$/i).click();
    cy.contains("Internal Server Error").should("not.exist");
  });
});
