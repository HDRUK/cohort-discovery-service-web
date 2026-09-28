describe("OIDC SSO login", () => {
  const oidcUsername = "testuser";
  const oidcPassword = "password";

  beforeEach(() => {
    cy.visit("/login");
  });

  it("displays SSO provider button when providers are available", () => {
    cy.contains("button", "Single Sign-On").should("be.visible");
  });

  it("redirects to IdP on provider button click", () => {
    cy.contains("a", "Single Sign-On").should(
      "have.attr",
      "href",
      /\/api\/auth\/sso\/default\/redirect/,
    );
  });

  it("completes full OIDC flow from login to dashboard", () => {
    cy.contains("a", "Single Sign-On").click();

    cy.origin("http://localhost:4011", () => {
      cy.get('input[name="Input.Username"]').type(oidcUsername);
      cy.get('input[name="Input.Password"]').type(oidcPassword);
      cy.contains("button", "Login").click();
    });

    cy.url().should("include", "/");
    cy.contains("My collections").should("be.visible");

    cy.getCookie("token").should("exist");
  });

  it("sets authentication cookie after successful exchange", () => {
    cy.contains("a", "Single Sign-On").click();

    cy.origin("http://localhost:4011", () => {
      cy.get('input[name="Input.Username"]').type(oidcUsername);
      cy.get('input[name="Input.Password"]').type(oidcPassword);
      cy.contains("button", "Login").click();
    });

    cy.getCookie("token").should("exist");
    cy.getCookie("token").should(($cookie) => {
      expect($cookie?.value).to.match(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/);
    });
  });

  it("handles invalid credentials from IdP", () => {
    cy.contains("a", "Single Sign-On").click();

    cy.origin("http://localhost:4011", () => {
      cy.get('input[name="Input.Username"]').type("wronguser");
      cy.get('input[name="Input.Password"]').type("wrongpassword");
      cy.contains("button", "Login").click();
    });

    cy.contains(/couldn't verify|failed/i).should("be.visible");
  });

  it("displays error page when callback receives error parameter", () => {
    cy.visit("/auth/sso/error?error=invalid_state");
    cy.contains(/session expired|try again/i).should("be.visible");
    cy.contains("a", "Back to login").should("be.visible");
  });

  it("displays error page with fallback message for unknown errors", () => {
    cy.visit("/auth/sso/error?error=unknown_error_code");
    cy.contains(/something went wrong/i).should("be.visible");
  });

  it("redirects to login on invalid callback (missing code and error)", () => {
    cy.visit("/auth/sso/callback");
    cy.url().should("include", "/auth/sso/error");
    cy.contains(/invalid|try again/i).should("be.visible");
  });
});
