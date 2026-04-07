/**
 * Admin – Workgroups tab.
 */
describe("Admin – Workgroups", () => {
  beforeEach(() => {
    cy.login("admin", { isAdmin: true });
    cy.visit("/admin/workgroups");
    cy.contains("Internal Server Error").should("not.exist");
  });

  it("renders the workgroups tab without errors", () => {
    cy.contains(/workgroup/i, { timeout: 10000 }).should("be.visible");
  });

  it("lists workgroups returned by the API", () => {
    // Names are lower-cased then first-letter capitalised by the UI
    cy.contains("Test workgroup alpha", { timeout: 15000 }).should("be.visible");
    cy.contains("Test workgroup beta").should("be.visible");
  });

  it("shows a button to create a new workgroup", () => {
    // AddButton with label "Workgroup" sits inside the "Create" ActionMenuSection
    cy.contains("button", "Workgroup", { timeout: 10000 }).should("be.visible");
  });

  it("opens the create workgroup form", () => {
    cy.contains("button", "Workgroup", { timeout: 10000 }).first().click();
    cy.contains(/name/i).should("be.visible");
  });

  it("creates a workgroup with valid input", () => {
    cy.contains("button", "Workgroup", { timeout: 10000 }).first().click();
    cy.get('input[name="name"], input[placeholder*="name" i]')
      .first()
      .type("E2E Test Workgroup");
    cy.contains("button", /save|create|submit/i)
      .first()
      .click();
    cy.contains("Internal Server Error").should("not.exist");
  });
});
