/**
 * Update collection – edit name/description of an existing collection.
 * Flow: click a table row → right panel shows UpdateCollection →
 *       click edit-panel-toggle to unlock → edit field → save.
 */
describe("Update collection", () => {
  beforeEach(() => {
    cy.login("admin", { isAdmin: true });
    cy.visit("/admin/collections");
    cy.contains("Collections", { timeout: 10000 }).should("be.visible");
  });

  it("shows an edit/update action for each collection row", () => {
    // Selecting a row reveals the edit toggle in the right panel
    cy.contains("Test Dataset Alpha", { timeout: 15000 }).click();
    cy.get('[data-testid="edit-panel-toggle"]', { timeout: 10000 }).should(
      "exist",
    );
  });

  it("opens the edit form when the edit action is clicked", () => {
    cy.contains("Test Dataset Alpha", { timeout: 15000 }).click();
    cy.get('[data-testid="edit-panel-toggle"]', { timeout: 10000 }).click();
    // Input should now be editable with the current collection name
    cy.get('input[value*="Test Dataset"]', { timeout: 5000 }).should("exist");
  });

  it("saves changes without error", () => {
    cy.contains("Test Dataset Alpha", { timeout: 15000 }).click();
    cy.get('[data-testid="edit-panel-toggle"]', { timeout: 10000 }).click();
    cy.get('input[value*="Test Dataset"]', { timeout: 5000 })
      .first()
      .clear()
      .type("Updated Collection Name");
    cy.get('[data-testid="save-panel-toggle"]', { timeout: 5000 })
      .first()
      .click();
    cy.contains("Internal Server Error").should("not.exist");
  });
});
