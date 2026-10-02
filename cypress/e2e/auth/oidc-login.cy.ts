describe("SSO sign-in options", () => {
  beforeEach(() => {
    cy.visit("/login");
    cy.contains("button", "Sign in").click();
  });

  it("offers both the password method and the configured SSO provider", () => {
    cy.contains("button", "Email and password").should("be.visible");
    cy.contains("a", "Single Sign-On").should("be.visible");
  });

  it("points the provider link at the redirect url the api supplied", () => {
    cy.contains("a", "Single Sign-On")
      .should("have.attr", "href")
      .and("match", /\/api\/auth\/sso\/default\/redirect$/);
  });
});

describe("SSO error handling", () => {
  it("explains an expired or reused sign-in session", () => {
    cy.visit("/auth/sso/error?error=invalid_state");
    cy.contains(/session expired or was already used/i).should("be.visible");
    cy.contains("a", "Back to login").should("be.visible");
  });

  it("falls back to a generic message for an unrecognised error code", () => {
    cy.visit("/auth/sso/error?error=unknown_error_code");
    cy.contains(/something went wrong/i).should("be.visible");
  });

  it("sends a callback with neither code nor error to the error page", () => {
    cy.visit("/auth/sso/callback");
    cy.url().should("include", "/auth/sso/error");
    cy.contains(/that sign-in link is invalid/i).should("be.visible");
  });

  it("forwards an idp error code through to the error page", () => {
    cy.visit("/auth/sso/callback?error=idp_error");
    cy.url().should("include", "/auth/sso/error");
    cy.contains(/rejected the sign-in attempt/i).should("be.visible");
  });
});
