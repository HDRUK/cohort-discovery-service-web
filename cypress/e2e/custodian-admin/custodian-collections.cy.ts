/**
 * Custodian admin – Collections tab.
 */
import { routes } from "@/config/routes";
import { CUSTODIAN_PID } from "../../support/test-constants";

describe("Custodian admin – Collections", () => {
  beforeEach(() => {
    cy.login("user", { custodianPid: CUSTODIAN_PID });
    cy.visit(routes.teamCollections(CUSTODIAN_PID));
    cy.contains("Collections", { timeout: 10000 }).should("be.visible");
  });

  it("renders the custodian collections tab without errors", () => {
    cy.contains("Internal Server Error").should("not.exist");
  });

  it("displays collections belonging to this custodian", () => {
    cy.contains("Test Dataset Alpha", { timeout: 15000 }).should("be.visible");
  });

  it("shows collection statuses", () => {
    cy.contains(/draft|active|pending/i, { timeout: 15000 }).should(
      "be.visible",
    );
  });
});
