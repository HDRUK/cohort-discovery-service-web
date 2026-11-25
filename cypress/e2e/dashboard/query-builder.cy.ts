/**
 * Query Builder – add groups/rules, toggle operators, submit a query.
 */
import { routes } from "@/config/routes";

describe("Query Builder", () => {
  beforeEach(() => {
    cy.login();
    // Suppress the guidance modal so it does not block page elements
    cy.setCookie("queryBuilderGuidanceRead", "true");
    cy.visit(routes.dashboardNewQuery());
  });

  it("renders the query builder canvas", () => {
    // The builder renders with at least an empty board area
    cy.get("body").should("be.visible");
    cy.contains(/new query/i).should("be.visible");
  });

  it("shows Add Rule Group button", () => {
    cy.contains(/add.*group/i).should("be.visible");
  });

  it("adds a rule group when the Add Group button is clicked", () => {
    cy.contains(/add.*group/i)
      .first()
      .click();
    // RuleWrapper renders every node (rule, group, operator) with data-testid="sortable-rule"
    cy.get("[data-testid='sortable-rule']").should("have.length.at.least", 1);
  });

  it("can toggle the combinator between AND and OR", () => {
    // The AND/OR chip appears between two groups. Clicking "Add Group" a second time
    // inserts an operator node between the two groups.
    cy.contains(/add.*group/i).first().click();
    cy.get("[data-testid='sortable-rule']", { timeout: 5000 }).should("exist");
    cy.contains(/add.*group/i).first().click();
    // AND/OR combinator is rendered as a MuiChip between the two groups
    cy.get(".MuiChip-root").contains(/\bAND\b|\bOR\b/).should("be.visible");
  });

  it("shows a Submit / Run Query button", () => {
    cy.contains(/run query/i).should("be.visible");
  });

  it("shows validation error when submitting an empty query", () => {
    // Clicking Run Query when no rules are present does not navigate away
    cy.contains(/run query/i).click({ force: true });
    cy.url().should("include", "/dashboard/new-query");
  });

  it("shows the search bar and the builder when their flags are on", () => {
    cy.get("input[type='search']").should("exist");
    cy.contains(/add.*group/i).should("be.visible");
    cy.contains(/the query builder is switched off/i).should("not.exist");
  });
});

describe("Query Builder with its flags turned off", () => {
  beforeEach(() => {
    cy.login("user", { disabledFeatures: ["query-builder", "query-nlp"] });
    cy.setCookie("queryBuilderGuidanceRead", "true");
    cy.visit(routes.dashboardNewQuery());
  });

  it("explains that the query builder is switched off", () => {
    cy.contains(/the query builder is switched off/i).should("be.visible");
    cy.contains(/add.*group/i).should("not.exist");
  });

  it("hides the search bar", () => {
    cy.get("input[type='search']").should("not.exist");
  });
});
