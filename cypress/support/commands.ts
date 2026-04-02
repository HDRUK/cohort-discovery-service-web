/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Seed the auth JWT cookie for the given role without driving the login UI.
       * @param role  - "user" | "admin" (default "user")
       * @param opts  - optional overrides forwarded to the generateToken task
       */
      login(
        role?: "user" | "admin",
        opts?: { isAdmin?: boolean; custodianPid?: string }
      ): Chainable<void>;

      /** Remove the auth cookie, simulating a logged-out state. */
      logout(): Chainable<void>;
    }
  }
}

Cypress.Commands.add(
  "login",
  (role = "user", opts: { isAdmin?: boolean; custodianPid?: string } = {}) => {
    cy.task("generateToken", {
      role,
      isAdmin: opts.isAdmin ?? role === "admin",
      custodianPid: opts.custodianPid,
    }).then((token) => {
      // Cookie name matches ACCESS_TOKEN_NAME default ("token").
      // domain must be explicit so the cookie is sent on the very first
      // cy.visit() call, before any page has been loaded in this spec.
      cy.setCookie("token", token as string, {
        domain: "localhost",
        path: "/",
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });
    });
  }
);

Cypress.Commands.add("logout", () => {
  cy.clearCookie("token");
});

export {};
