/**
 * Query History tab – lists past queries, allows re-running them.
 */
describe("Query History", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/dashboard/query-history");
  });

  it("renders the query history page without errors", () => {
    cy.contains("Internal Server Error").should("not.exist");
    cy.contains(/query history/i).should("be.visible");
  });

  it("displays past queries from the API", () => {
    // The history table should list query names from the fixture
    cy.contains("Test Query One", { timeout: 10000 }).should("be.visible");
  });

  it("displays the second query in the list", () => {
    cy.contains("Test Query Two", { timeout: 10000 }).should("be.visible");
  });

  it("shows query creation dates", () => {
    cy.contains(/2025/i).should("be.visible");
  });
});
