/**
 * Standalone login flow.
 * Requires APPLICATION_MODE=standalone and the mock API server.
 */
const email = () => Cypress.env("CYPRESS_USER_EMAIL") || "test@example.com";
const password = () => Cypress.env("CYPRESS_USER_PASSWORD") || "password123";

const openAuthScreen = () => {
  cy.contains("button:visible", "Log in").click();
  cy.get('input[type="email"]').should("be.visible");
};

describe("Login", () => {
  beforeEach(() => {
    cy.clearCookie("token");
    cy.visit("/login");
  });

  it("opens on the welcome screen", () => {
    cy.contains("Cohort Discovery").should("be.visible");
    cy.contains("button:visible", "Log in").should("be.visible");
    cy.get('input[type="email"]').should("not.be.visible");
  });

  it("slides to the auth screen with the sign-in options", () => {
    openAuthScreen();

    cy.contains("Welcome back.").should("be.visible");
    cy.get('input[type="password"]').should("be.visible");
    cy.contains("a", "Single Sign-On").should("be.visible");
  });

  it("toggles password visibility", () => {
    openAuthScreen();

    cy.get('input[type="password"]').type(password());
    cy.contains("button", "Show password").click();
    cy.get('input[name="password"]').should("have.attr", "type", "text");
    cy.contains("button", "Hide password").click();
    cy.get('input[name="password"]').should("have.attr", "type", "password");
  });

  it("logs in with valid credentials and lands on the dashboard", () => {
    openAuthScreen();

    cy.get('input[type="email"]').type(email());
    cy.get('input[type="password"]').type(password());
    cy.get('button[type="submit"]').click();

    cy.url({ timeout: 15000 }).should("include", "/dashboard");
  });

  it("shows an error on invalid credentials", () => {
    openAuthScreen();

    cy.get('input[type="email"]').type("wrong@example.com");
    cy.get('input[type="password"]').type("wrongpassword");
    cy.get('button[type="submit"]').click();

    cy.contains("Incorrect credentials").should("be.visible");
    cy.url().should("include", "/login");
  });

  it("goes back to the welcome screen", () => {
    openAuthScreen();

    cy.contains("button", "Back").click();
    cy.get('input[type="email"]').should("not.be.visible");
    cy.contains("button:visible", "Log in").should("be.visible");
  });

  it("links the legal footer at the gateway policies", () => {
    openAuthScreen();

    cy.contains("a", "Privacy policy")
      .should("have.attr", "href")
      .and("include", "/about/privacy-policy");
    cy.contains("a", "Terms of use")
      .should("have.attr", "href")
      .and("include", "/terms-and-conditions");
  });

  it("redirects to the dashboard if already authenticated", () => {
    cy.login();
    cy.visit("/login");
    cy.url().should("not.include", "/login");
  });
});

describe("Logged-out redirects", () => {
  beforeEach(() => cy.clearCookie("token"));

  it("sends the root path to the login screen", () => {
    cy.visit("/");
    cy.url({ timeout: 10000 }).should("include", "/login");
  });

  it("remembers where the user was heading", () => {
    cy.visit("/term-directory");
    cy.url({ timeout: 10000 }).should("include", "return_to");
    cy.url().should("include", encodeURIComponent("/term-directory"));
  });

  it("returns the user to where they were heading after signing in", () => {
    cy.visit("/term-directory");
    cy.url({ timeout: 10000 }).should("include", "/login");

    cy.contains("button:visible", "Log in").click();
    cy.get('input[type="email"]').type(email());
    cy.get('input[type="password"]').type(password());
    cy.get('button[type="submit"]').click();

    cy.url({ timeout: 15000 }).should("include", "/term-directory");
  });
});
