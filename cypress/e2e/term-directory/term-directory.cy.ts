describe("Term Directory", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/term-directory");
  });

  it("renders the page heading", () => {
    cy.contains("Term Directory").should("be.visible");
  });

  it("shows the correct table columns", () => {
    cy.contains("OMOP Concept ID").should("be.visible");
    cy.contains("Term Name").should("be.visible");
    cy.contains("Count").should("be.visible");
    cy.contains("Associated Collections").should("be.visible");
  });

  it("renders rows from the fixture", () => {
    cy.contains("Type 2 diabetes mellitus").should("be.visible");
    cy.contains("Myocardial infarction").should("be.visible");
  });
});
