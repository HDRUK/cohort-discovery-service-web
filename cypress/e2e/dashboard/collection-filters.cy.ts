/**
 * Collection Type filters – the checkbox row at the top of the Collections
 * filter panel. Fixture has 5 collections: Gamma is synthetic, Delta has death
 * data, Epsilon has location data. Synthetic starts deselected, so the panel
 * opens at 4/5.
 */
import { routes } from "@/config/routes";

const openPanel = () => {
  cy.get('[data-testid="filter-datasets-chip"]', { timeout: 15000 }).click();
  cy.contains("Collection Type", { timeout: 10000 }).should("be.visible");
};

const collectionCheckbox = (name: string) =>
  cy.contains(".MuiChip-root", name).find('input[type="checkbox"]');

describe("Collection Type filters", () => {
  beforeEach(() => {
    cy.login();
    // Suppress the guidance modal so it does not block page elements
    cy.setCookie("queryBuilderGuidanceRead", "true");
    cy.visit(routes.dashboardNewQuery());
    openPanel();
  });

  it("renders a checkbox for each collection type", () => {
    cy.get('input[aria-label="synthetic"]').should("exist");
    cy.get('input[aria-label="includes death data"]').should("exist");
    cy.get('input[aria-label="includes location data"]').should("exist");

    // The old standalone toggle is gone
    cy.contains("Synthetic Data Collections").should("not.exist");
  });

  it("derives initial checkbox state from the current selection", () => {
    cy.contains("4/5 Collections Selected").should("be.visible");

    // Synthetic collections are excluded on load; death/location ones are not
    cy.get('input[aria-label="synthetic"]').should("not.be.checked");
    cy.get('input[aria-label="includes death data"]').should("be.checked");
    cy.get('input[aria-label="includes location data"]').should("be.checked");
  });

  it("selects synthetic collections when the synthetic filter is checked", () => {
    cy.get('[data-testid="collection-type-synthetic"]').click();

    cy.contains("5/5 Collections Selected").should("be.visible");
    collectionCheckbox("Test Dataset Gamma").should("be.checked");
  });

  it("deselects death-data collections when the death filter is unchecked", () => {
    cy.get('[data-testid="collection-type-death"]').click();

    cy.contains("3/5 Collections Selected").should("be.visible");
    collectionCheckbox("Test Dataset Delta").should("not.be.checked");
  });

  it("updates the filter checkbox when a collection is deselected in the tree", () => {
    cy.get('input[aria-label="includes death data"]').should("be.checked");

    collectionCheckbox("Test Dataset Delta").click({ force: true });

    cy.contains("3/5 Collections Selected").should("be.visible");
    cy.get('input[aria-label="includes death data"]').should("not.be.checked");
  });
});
