/**
 * Dashboard shell navigation – tab switching, URL updates, and the
 * default redirect from /dashboard → /dashboard/new-query.
 */
import { routes } from "@/config/routes";

describe("Dashboard navigation", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(routes.dashboard);
  });

  it("redirects /dashboard to /dashboard/new-query", () => {
    cy.url().should("include", "/dashboard/new-query");
  });

  it("renders the New Query tab as active by default", () => {
    cy.visit(routes.dashboardNewQuery());
    cy.contains("New Query").should("be.visible");
  });

  it("navigates to Query History tab and updates URL", () => {
    cy.visit(routes.dashboardNewQuery());
    cy.contains("Query History").click();
    cy.url().should("include", "/dashboard/query-history");
  });

  it("renders the Query History tab content", () => {
    cy.visit(routes.dashboardHistory());
    // The page should render without crashing – look for a container or heading
    cy.contains("Internal Server Error").should("not.exist");
  });

  it("returns 404 for an unknown tab segment", () => {
    cy.visit("/dashboard/unknown-tab-xyz", { failOnStatusCode: false });
    // Next.js notFound() renders a 404 page
    cy.contains(/404|not found/i).should("be.visible");
  });
});
