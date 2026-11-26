import { routes } from "@/config/routes";

const PAGE_MARKER = "loadedBeforeSessionEnded";

const markCurrentPage = () =>
  cy.window().then((win) => {
    Object.assign(win, { [PAGE_MARKER]: true });
  });

const clickConfigurationInUserMenu = () => {
  cy.get('img[alt="user icon"]').click();
  cy.get("#composition-menu").contains("Configuration").click();
};

const assertSignedOutPageWasFullyLoaded = () => {
  cy.location("pathname", { timeout: 10000 }).should("eq", routes.login);
  cy.window().should("not.have.property", PAGE_MARKER);
  cy.get('img[alt="user icon"]').should("not.exist");
  cy.get("#composition-menu").should("not.exist");
  cy.contains("Test User").should("not.exist");
};

describe("Navigating after the session has ended", () => {
  beforeEach(() => {
    cy.login("admin");
    cy.setCookie("queryBuilderGuidanceRead", "true");
    cy.visit(routes.dashboardNewQuery());
    cy.contains("Test User").should("be.visible");
    markCurrentPage();
  });

  it("drops the signed-in page when the cookie has been cleared", () => {
    cy.logout();
    clickConfigurationInUserMenu();
    assertSignedOutPageWasFullyLoaded();
  });

  it("drops the signed-in page when the token has expired", () => {
    cy.task("generateExpiredToken").then((token) => {
      cy.setCookie("token", token as string, {
        domain: "localhost",
        path: "/",
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });
    });
    clickConfigurationInUserMenu();
    assertSignedOutPageWasFullyLoaded();
    cy.getCookie("token").should("be.null");
  });
});
