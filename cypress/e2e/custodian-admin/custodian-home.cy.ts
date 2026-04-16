/**
 * Custodian admin – landing page.
 *
 * The /custodian-admin page reads ?external_id, finds the matching custodian
 * (string comparison from URL param vs fixture's external_custodian_id "100"),
 * and redirects to /custodian-admin/:pid.
 */
import { routes } from "@/config/routes";
import { CUSTODIAN_PID } from "../../support/test-constants";

describe("Custodian admin – home", () => {
  beforeEach(() => {
    cy.login("user", { custodianPid: CUSTODIAN_PID });
  });

  it("redirects to the custodian team page when external_id matches", () => {
    // external_custodian_id in the fixture is "100" (string) to match URL param
    cy.visit("/custodian-admin?external_id=100");
    cy.url({ timeout: 10000 }).should("include", `/custodian-admin/${CUSTODIAN_PID}`);
  });

  it("renders the custodian team page without errors", () => {
    // Navigate directly to avoid the redirect dependency
    cy.visit(routes.teamHosts(CUSTODIAN_PID));
    cy.contains("Internal Server Error").should("not.exist");
  });

  it("redirects /custodian-admin/:pid to the hosts tab", () => {
    cy.visit(routes.teamHome(CUSTODIAN_PID));
    cy.url({ timeout: 10000 }).should("include", "/hosts");
  });
});
