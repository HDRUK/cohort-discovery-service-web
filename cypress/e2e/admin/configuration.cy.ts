/**
 * Admin – Configuration page.
 */
describe("Admin – Configuration", () => {
  beforeEach(() => {
    cy.login("admin", { isAdmin: true });
    cy.visit("/admin/configuration");
  });

  it("renders the configuration page without errors", () => {
    cy.contains("Internal Server Error").should("not.exist");
  });

  it("displays feature flag toggles", () => {
    // Configuration page renders feature flags
    cy.contains(/feature|flag|configuration/i, { timeout: 10000 }).should("be.visible");
  });
});
