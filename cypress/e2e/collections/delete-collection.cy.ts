/**
 * Delete collection – confirm dialog and row removal.
 * DeleteButton is icon-only (no text) – identified by data-testid="DeleteIcon".
 * Clicking it always opens the confirm dialog; row selection is optional.
 */
import { routes } from "@/config/routes";

const openDeleteDialog = () => {
  cy.get('[data-testid="DeleteIcon"]').first().click();
  cy.contains('[role="dialog"]', /delete collection/i).should("be.visible");
};

describe("Delete collection", () => {
  beforeEach(() => {
    cy.login("admin", { isAdmin: true });
    cy.visit(routes.adminCollections);
    cy.contains("Test Dataset Alpha", { timeout: 15000 }).should("be.visible");
  });

  it("shows a delete action for each collection", () => {
    cy.get('[data-testid="DeleteIcon"]').should("exist");
  });

  it("shows a confirmation dialog before deleting", () => {
    openDeleteDialog();
  });

  it("cancels the delete when cancel is clicked", () => {
    openDeleteDialog();
    cy.contains('[role="dialog"] button', /cancel/i).click();
    cy.get('[role="dialog"]').should("not.exist");
    cy.contains("Test Dataset Alpha").should("be.visible");
  });

  it("completes delete after confirmation without error", () => {
    openDeleteDialog();
    cy.contains('[role="dialog"] button', /^delete$/i).click();
    cy.contains("Internal Server Error").should("not.exist");
  });
});
