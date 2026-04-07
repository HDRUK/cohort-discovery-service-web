/**
 * My Definitions page – concept set CRUD and concept search/attach/detach.
 */
describe("Concept sets", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/my-definitions");
  });

  it("renders the My Definitions page without errors", () => {
    cy.contains("Internal Server Error").should("not.exist");
  });

  it("displays existing concept sets from the API", () => {
    cy.contains("Diabetes Concepts", { timeout: 10000 }).should("be.visible");
    cy.contains("Hypertension Concepts").should("be.visible");
  });

  it("shows concepts attached to a set", () => {
    cy.contains("Type 2 diabetes mellitus", { timeout: 10000 }).should(
      "be.visible",
    );
  });

  it("shows a button to create a new concept set", () => {
    // CreateConceptSet renders an IconButton with text " definition"
    cy.contains("button", /definition/i).should("be.visible");
  });

  it("opens the create concept set form", () => {
    cy.contains("button", /definition/i).click();
    // Form appears with a Name field
    cy.get('input[name="name"]', { timeout: 5000 }).should("exist");
  });

  it("submits a new concept set with valid data", () => {
    cy.contains("button", /definition/i).click();
    cy.get('input[name="name"]', { timeout: 5000 })
      .first()
      .type("New E2E Concept Set");
    cy.contains("button", /save|create|submit/i)
      .first()
      .click();
    cy.contains("Internal Server Error").should("not.exist");
  });

  it("can search for OMOP concepts", () => {
    // Open the "Add a concept" modal by clicking the add icon in the first expanded row
    cy.contains("Diabetes Concepts", { timeout: 10000 }).should("be.visible");
    // The AddNewConcept button is a small icon button that is not the delete button
    cy.get('button.MuiIconButton-sizeSmall')
      .not('[aria-label="delete concept"]')
      .not('[aria-label="Toggle Row Expanded"]')
      .first()
      .click({ force: true });
    // The search modal should open with a SearchBar input (placeholder "Search…")
    cy.get('input[placeholder*="Search" i]', { timeout: 5000 })
      .first()
      .type("diabetes");
    cy.contains("Type 2 diabetes mellitus", { timeout: 10000 }).should(
      "be.visible",
    );
  });

  it("shows a delete action for concept sets", () => {
    // ActionDeleteButton renders an icon-only button with aria-label="delete concept"
    cy.get('[aria-label="delete concept"]', { timeout: 10000 }).should("exist");
  });
});
