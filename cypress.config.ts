import { defineConfig } from "cypress";
import jwt from "jsonwebtoken";

// Secret only used for test token generation.
// Auth uses jwt.decode() (not verify) so any secret produces valid tokens.
const CYPRESS_JWT_SECRET = "cypress-test-secret";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.cy.ts",
    supportFile: "cypress/support/e2e.ts",
    fixturesFolder: "cypress/fixtures",
    video: true,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 900,
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    experimentalRunAllSpecs: true,

    setupNodeEvents(on) {
      on("task", {
        /**
         * Generate a JWT cookie value for a given role.
         * Mirrors the TokenUser shape expected by src/lib/auth.ts.
         */
        generateToken({
          role = "user",
          isAdmin = false,
          custodianPid,
        }: {
          role?: string;
          isAdmin?: boolean;
          custodianPid?: string;
        } = {}) {
          const payload = {
            user: {
              id: 1,
              email: "test@example.com",
              orcid: "",
              name: "Test User",
              firstname: "Test",
              lastname: "User",
              is_admin: isAdmin,
              is_nhse_sde_approval: false,
              organisation: "Test Org",
              provider: "standalone",
              workgroups: ["Test Workgroup"],
              cohort_discovery_roles: [role],
              cohort_admin_teams: custodianPid
                ? [{ id: 1, name: "Test Custodian" }]
                : [],
            },
          };
          return jwt.sign(payload, CYPRESS_JWT_SECRET, { expiresIn: "1h" });
        },

        generateExpiredToken() {
          const payload = {
            user: {
              id: 1,
              email: "test@example.com",
              name: "Test User",
              cohort_discovery_roles: ["user"],
              cohort_admin_teams: [],
            },
          };
          // exp in the past
          return jwt.sign(payload, CYPRESS_JWT_SECRET, { expiresIn: -1 });
        },
      });
    },
  },
});
