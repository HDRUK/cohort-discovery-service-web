const IDP_ORIGIN = "http://localhost:4011";

const signInAtIdp = (username: string, password: string) => {
  cy.visit("/login");
  cy.contains("button:visible", "Log in").click();
  cy.get('input[type="email"]').should("be.visible");
  cy.contains("a", "Single Sign-On").click();

  cy.origin(IDP_ORIGIN, { args: { username, password } }, ({ username, password }) => {
    cy.get('input[name="Input.Username"]').type(username);
    cy.get('input[name="Input.Password"]').type(password);
    cy.contains("button", "Login").click();
  });
};

describe("OIDC round trip against the mock identity provider", () => {
  it("signs a known user in and lands them on the dashboard", () => {
    signInAtIdp("testuser", "password");

    cy.contains("My collections").should("be.visible");
    cy.getCookie("token").should("exist");
  });

  it("stores a well-formed jwt once the code has been exchanged", () => {
    signInAtIdp("testuser", "password");

    cy.getCookie("token").should(($cookie) => {
      expect($cookie?.value).to.match(
        /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/,
      );
    });
  });

  it("keeps the user at the identity provider when the credentials are wrong", () => {
    signInAtIdp("wronguser", "wrongpassword");

    cy.origin(IDP_ORIGIN, () => {
      cy.contains(/invalid username or password/i).should("be.visible");
    });
    cy.getCookie("token").should("not.exist");
  });
});
