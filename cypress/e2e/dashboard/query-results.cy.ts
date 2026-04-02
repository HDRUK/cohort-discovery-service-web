/**
 * Query results tab – view counts per dataset after a query run.
 * Uses a direct URL to simulate a result tab already being open.
 */
describe("Query Results", () => {
  beforeEach(() => {
    cy.login();
  });

  it("renders a result tab for a known query pid", () => {
    cy.visit(
      "/dashboard/query-result-query-pid-1?query=query-pid-1&open_queries=query-pid-1"
    );
    cy.contains("Internal Server Error").should("not.exist");
  });

  it("shows dataset count results from the API", () => {
    cy.visit(
      "/dashboard/query-result-query-pid-1?query=query-pid-1&open_queries=query-pid-1"
    );
    // The mock returns counts of 723 and 421
    cy.contains(/723|421/, { timeout: 10000 }).should("be.visible");
  });

  it("shows collection names alongside their counts", () => {
    cy.visit(
      "/dashboard/query-result-query-pid-1?query=query-pid-1&open_queries=query-pid-1"
    );
    cy.contains("Test Dataset Alpha", { timeout: 10000 }).should("be.visible");
  });
});
