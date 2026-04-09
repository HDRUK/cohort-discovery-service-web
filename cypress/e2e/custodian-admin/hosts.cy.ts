/**
 * Custodian admin – Hosts tab.
 */
import { routes } from "@/config/routes";
import { CUSTODIAN_PID } from "../../support/test-constants";

describe("Custodian admin – Hosts", () => {
  beforeEach(() => {
    cy.login("user", { custodianPid: CUSTODIAN_PID });
    cy.visit(routes.teamHosts(CUSTODIAN_PID));
  });

  it("renders the hosts tab without errors", () => {
    cy.contains("Internal Server Error").should("not.exist");
  });

  it("displays collection hosts from the API", () => {
    cy.contains("Test Host Alpha", { timeout: 10000 }).should("be.visible");
    cy.contains("Test Host Beta").should("be.visible");
  });

  it("shows the query context type for each host", () => {
    cy.contains(/BUNNY/i, { timeout: 10000 }).should("be.visible");
  });

  it("shows a button to add a new host", () => {
    cy.contains(/create|new.*host|add.*host/i).should("be.visible");
  });

  it("opens the create host form", () => {
    cy.contains(/create|new.*host|add.*host/i).first().click();
    cy.contains(/name/i).should("be.visible");
  });
});
