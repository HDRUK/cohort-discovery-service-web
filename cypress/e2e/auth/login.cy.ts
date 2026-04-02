/**
 * Standalone login flow.
 * Requires APPLICATION_MODE=standalone and the mock API server.
 */
describe("Login", () => {
  beforeEach(() => {
    cy.clearCookie("token");
    cy.visit("/login");
  });

  it("renders the Sign in button on the login page", () => {
    cy.contains("button", "Sign in").should("be.visible");
  });

  it("shows the login form when Sign in is clicked", () => {
    cy.contains("button", "Sign in").click();
    cy.contains("Login").should("be.visible");
    cy.get('input[type="email"]').should("be.visible");
    cy.get('input[type="password"]').should("be.visible");
  });

  it("logs in with valid credentials and redirects to dashboard", () => {
    cy.contains("button", "Sign in").click();
    cy.get('input[type="email"]').type(Cypress.env("CYPRESS_USER_EMAIL") || "test@example.com");
    cy.get('input[type="password"]').type(Cypress.env("CYPRESS_USER_PASSWORD") || "password123");
    cy.contains("button", "Login").click();
    // After successful login the server action sets the cookie and redirects
    cy.url({ timeout: 15000 }).should("include", "/dashboard");
  });

  it("shows error on invalid credentials", () => {
    cy.contains("button", "Sign in").click();
    cy.get('input[type="email"]').type("wrong@example.com");
    cy.get('input[type="password"]').type("wrongpassword");
    cy.contains("button", "Login").click();
    cy.contains("Incorrect credentials").should("be.visible");
  });

  it("Cancel button hides the login form", () => {
    cy.contains("button", "Sign in").click();
    cy.contains("button", "Cancel").click();
    cy.get('input[type="email"]').should("not.exist");
    cy.contains("button", "Sign in").should("be.visible");
  });

  it("redirects to dashboard if already authenticated", () => {
    cy.login();
    cy.visit("/login");
    cy.url().should("not.include", "/login");
  });
});
