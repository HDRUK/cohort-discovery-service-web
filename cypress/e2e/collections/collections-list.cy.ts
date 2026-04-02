/**
 * Collections list – admin view at /admin/collections.
 * Collections are managed through the admin panel; there is no standalone
 * user-facing collections route on the dashboard.
 */
describe("Collections list", () => {
  beforeEach(() => {
    cy.login("admin", { isAdmin: true });
    cy.visit("/admin/collections");
  });

  it("renders the collections tab without errors", () => {
    cy.contains("Internal Server Error").should("not.exist");
    // Page title rendered by CollectionsManagement
    cy.contains("Collections", { timeout: 10000 }).should("be.visible");
  });

  it("displays collection names from the API", () => {
    // CollectionsManagement is a client component — it stores data in Zustand
    // via useEffect then CollectionsTable re-renders; allow time for that cycle
    cy.contains("Test Dataset Alpha", { timeout: 15000 }).should("be.visible");
  });

  it("displays the second collection", () => {
    cy.contains("Test Dataset Beta", { timeout: 15000 }).should("be.visible");
  });

  it("shows custodian names alongside collections", () => {
    cy.contains("Test Custodian", { timeout: 15000 }).should("be.visible");
  });
});
