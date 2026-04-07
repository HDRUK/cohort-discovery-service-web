/**
 * Cypress mock API server.
 *
 * Runs at http://localhost:8100 and handles all requests that the Next.js
 * server actions forward to API_BASE_URL.  Responses mirror the real API's
 * shape so the app renders as it would against a live backend.
 *
 * Start: node cypress/support/mock-server.js
 */

const http = require("http");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

const PORT = 8100;
const CYPRESS_JWT_SECRET = "cypress-test-secret";

// ---------------------------------------------------------------------------
// Fixture loader
// ---------------------------------------------------------------------------
const FIXTURES_DIR = path.join(__dirname, "../fixtures");

function fixture(name) {
  return JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, `${name}.json`), "utf8"));
}

// ---------------------------------------------------------------------------
// JWT helper – mirrors the token shape decoded by src/lib/auth.ts
// ---------------------------------------------------------------------------

/**
 * Decode the Authorization header bearer token without verifying.
 * Returns the payload object or null if missing/malformed.
 */
function decodeAuthToken(req) {
  const authHeader = req.headers["authorization"] || "";
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;
  try {
    const [, payload] = match[1].split(".");
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

function makeToken(overrides = {}) {
  const payload = {
    user: {
      id: 1,
      email: "test@example.com",
      orcid: "",
      name: "Test User",
      firstname: "Test",
      lastname: "User",
      is_admin: false,
      is_nhse_sde_approval: false,
      organisation: "Test Org",
      provider: "standalone",
      workgroups: ["Test Workgroup"],
      cohort_discovery_roles: ["user"],
      cohort_admin_teams: [],
      ...overrides,
    },
  };
  return jwt.sign(payload, CYPRESS_JWT_SECRET, { expiresIn: "1h" });
}

// ---------------------------------------------------------------------------
// Simple router
// ---------------------------------------------------------------------------
function matchRoute(pattern, reqPath) {
  const patternParts = pattern.split("/");
  const pathParts = reqPath.split("/");
  if (patternParts.length !== pathParts.length) return null;
  const params = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(":")) {
      params[patternParts[i].slice(1)] = pathParts[i];
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }
  return params;
}

function json(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
  res.end(JSON.stringify(body));
}

function ok(res, data, message = "success") {
  json(res, 200, { message, data });
}

function created(res, data) {
  json(res, 201, { message: "created", data });
}

function noContent(res) {
  res.writeHead(204, { "Access-Control-Allow-Origin": "*" });
  res.end();
}

function readBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try { resolve(JSON.parse(body)); } catch { resolve({}); }
    });
  });
}

// ---------------------------------------------------------------------------
// Route table
// ---------------------------------------------------------------------------
async function handle(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;
  const method = req.method;

  // Health check
  if (method === "GET" && pathname === "/health") {
    return ok(res, { status: "ok" });
  }

  // OPTIONS pre-flight
  if (method === "OPTIONS") {
    res.writeHead(200, { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "*", "Access-Control-Allow-Headers": "*" });
    return res.end();
  }

  // -------------------------------------------------------------------------
  // Auth
  // -------------------------------------------------------------------------
  if (method === "POST" && pathname === "/api/auth/login") {
    const body = await readBody(req);
    // Only the configured test email is accepted; everything else is rejected.
    const VALID_EMAIL = "test@example.com";
    if (!body.email || !body.password || body.email !== VALID_EMAIL) {
      return json(res, 401, { message: "Incorrect credentials" });
    }
    return ok(res, { access_token: makeToken() });
  }

  // -------------------------------------------------------------------------
  // Current user – return admin role / custodians based on the JWT payload
  // -------------------------------------------------------------------------
  if (method === "GET" && pathname === "/api/v1/user") {
    const decoded = decodeAuthToken(req);
    const tokenUser = decoded?.user ?? {};
    const isAdmin = !!tokenUser.is_admin;
    const adminTeams = Array.isArray(tokenUser.cohort_admin_teams) ? tokenUser.cohort_admin_teams : [];

    const base = fixture("user");
    if (isAdmin) {
      base.data.roles = [{ id: 2, name: "admin", created_at: "2025-01-01T00:00:00Z", updated_at: "2025-01-01T00:00:00Z" }];
    }
    if (adminTeams.length > 0) {
      const allCustodians = fixture("custodians").data;
      base.data.custodians = allCustodians.filter((c) =>
        adminTeams.some((t) => t.id === c.id)
      );
    }
    return json(res, 200, base);
  }

  // -------------------------------------------------------------------------
  // Feature flags
  // -------------------------------------------------------------------------
  if (method === "GET" && pathname === "/api/v1/features") {
    return json(res, 200, fixture("features"));
  }

  if (method === "PUT" && matchRoute("/api/v1/features/:name", pathname)) {
    const body = await readBody(req);
    return ok(res, { name: pathname.split("/").pop(), ...body });
  }

  // -------------------------------------------------------------------------
  // Queries
  // -------------------------------------------------------------------------
  if (method === "GET" && pathname === "/api/v1/queries") {
    return json(res, 200, fixture("queries"));
  }

  if (method === "POST" && pathname === "/api/v1/queries") {
    return json(res, 200, fixture("query-submit"));
  }

  if (method === "DELETE" && pathname === "/api/v1/queries/delete/bulk") {
    return noContent(res);
  }

  {
    const params = matchRoute("/api/v1/query/:pid", pathname);
    if (method === "GET" && params) {
      return json(res, 200, fixture("query"));
    }
  }

  {
    const params = matchRoute("/api/v1/query/:pid/results", pathname);
    if (method === "GET" && params) {
      return json(res, 200, fixture("query"));
    }
  }

  {
    const params = matchRoute("/api/v1/query/re-run/:id", pathname);
    if (method === "POST" && params) {
      return json(res, 200, fixture("query-submit"));
    }
  }

  if (method === "POST" && pathname === "/api/v1/parse-query") {
    const body = await readBody(req);
    return ok(res, { valid: true, query: body });
  }

  // -------------------------------------------------------------------------
  // Collections
  // -------------------------------------------------------------------------
  if (method === "GET" && pathname === "/api/v1/collections") {
    // Admin layout calls getCollections() expecting ApiResponse<Collection[]> (non-paginated).
    // The paginated shape is served by /api/v1/admin/collections.
    return json(res, 200, fixture("collections"));
  }

  if (method === "POST" && pathname === "/api/v1/collections") {
    const body = await readBody(req);
    return created(res, {
      id: 99, pid: "col-pid-new", ...body,
      model_state: { id: 1, state: { id: 1, name: "DRAFT", slug: "draft" }, state_id: 1, stateable_id: 99, stateable_type: "App\\Models\\Collection", updated_at: new Date().toISOString() },
      custodian: fixture("custodian"),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  {
    const params = matchRoute("/api/v1/collections/:id", pathname);
    if (params) {
      if (method === "GET") return json(res, 200, { message: "success", data: fixture("collections").data[0] });
      if (method === "PUT") {
        const body = await readBody(req);
        return ok(res, { ...fixture("collections").data[0], ...body });
      }
      if (method === "DELETE") return noContent(res);
    }
  }

  if (method === "GET" && pathname === "/api/v1/admin/collections") {
    return json(res, 200, fixture("collections-paginated"));
  }

  if (method === "GET" && pathname === "/api/v1/user/collections") {
    return json(res, 200, fixture("collections"));
  }

  if (method === "PUT" && pathname.startsWith("/api/v1/collections/") && pathname.endsWith("/transition")) {
    return ok(res, {});
  }

  // Collection config
  if (method === "GET" && pathname === "/api/v1/collection_config") {
    return ok(res, { id: 1, enabled: true, frequency_mode: 1, run_time_frequency: 1, run_time_hour: 0, run_time_minute: 0 });
  }

  if (method === "POST" && pathname === "/api/v1/collection_config") {
    const body = await readBody(req);
    return created(res, { id: 1, ...body });
  }

  // -------------------------------------------------------------------------
  // Collection hosts
  // -------------------------------------------------------------------------
  if (method === "GET" && pathname === "/api/v1/collection_hosts") {
    return json(res, 200, fixture("collection-hosts"));
  }

  if (method === "POST" && pathname === "/api/v1/collection_hosts") {
    const body = await readBody(req);
    return created(res, { id: 99, client_id: "new-client", client_secret: "new-secret", custodian: fixture("custodian"), collections: [], ...body });
  }

  {
    const params = matchRoute("/api/v1/collection_hosts/:id", pathname);
    if (params) {
      if (method === "PUT") {
        const body = await readBody(req);
        return ok(res, { ...fixture("collection-hosts").data[0], ...body });
      }
      if (method === "DELETE") return noContent(res);
    }
  }

  // -------------------------------------------------------------------------
  // Custodians
  // -------------------------------------------------------------------------
  if (method === "GET" && pathname === "/api/v1/custodians") {
    return json(res, 200, fixture("custodians"));
  }

  {
    const params = matchRoute("/api/v1/custodians/:pid", pathname);
    if (method === "GET" && params && !pathname.includes("/collections") && !pathname.includes("/collection_hosts")) {
      return ok(res, fixture("custodians").data[0]);
    }
  }

  {
    const params = matchRoute("/api/v1/custodians/:pid/collections", pathname);
    if (method === "GET" && params) {
      return json(res, 200, fixture("collections-paginated"));
    }
  }

  {
    const params = matchRoute("/api/v1/custodians/:pid/collection_hosts", pathname);
    if (method === "GET" && params) {
      return json(res, 200, fixture("collection-hosts"));
    }
  }

  // rerun distributions
  {
    const params = matchRoute("/api/v1/collection/:pid/distributions/run-manually", pathname);
    if (method === "POST" && params) {
      return ok(res, {});
    }
  }

  // -------------------------------------------------------------------------
  // Networks
  // -------------------------------------------------------------------------
  if (method === "GET" && pathname === "/api/v1/custodian_networks") {
    return json(res, 200, fixture("networks"));
  }

  if (method === "POST" && pathname === "/api/v1/custodian_networks") {
    const body = await readBody(req);
    return created(res, { id: 99, pid: "net-pid-new", enabled: true, custodians: [], ...body });
  }

  {
    const params = matchRoute("/api/v1/custodian_networks/:id", pathname);
    if (params) {
      if (method === "PUT") {
        const body = await readBody(req);
        return ok(res, { ...fixture("networks").data[0], ...body });
      }
      if (method === "DELETE") return noContent(res);
    }
  }

  // -------------------------------------------------------------------------
  // Concept sets
  // -------------------------------------------------------------------------
  if (method === "GET" && pathname === "/api/v1/concept_sets") {
    return json(res, 200, fixture("concept-sets"));
  }

  if (method === "POST" && pathname === "/api/v1/concept_sets") {
    const body = await readBody(req);
    return created(res, { id: 99, concepts: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString(), ...body });
  }

  {
    const params = matchRoute("/api/v1/concept_sets/:id", pathname);
    if (params && method === "DELETE") return noContent(res);
  }

  {
    const params = matchRoute("/api/v1/concept_sets/:id/clear", pathname);
    if (params && method === "POST") {
      return ok(res, { ...fixture("concept-sets").data[0], concepts: [] });
    }
  }

  {
    const params = matchRoute("/api/v1/concept_sets/:id/attach/:conceptId", pathname);
    if (params && method === "POST") {
      return ok(res, fixture("concept-sets").data[0]);
    }
  }

  {
    const params = matchRoute("/api/v1/concept_sets/:id/detach/:conceptId", pathname);
    if (params && method === "DELETE") {
      return ok(res, { ...fixture("concept-sets").data[0], concepts: [] });
    }
  }

  // -------------------------------------------------------------------------
  // OMOP concept search
  // -------------------------------------------------------------------------
  if (method === "GET" && pathname === "/api/v1/omop/concepts/search") {
    return json(res, 200, fixture("concepts-search"));
  }

  // OMOP code stats
  {
    const params = matchRoute("/api/v1/codes/:domain", pathname);
    if (method === "GET" && params) {
      return ok(res, []);
    }
  }

  // -------------------------------------------------------------------------
  // Workgroups
  // -------------------------------------------------------------------------
  if (method === "GET" && pathname === "/api/v1/workgroups") {
    return json(res, 200, fixture("workgroups"));
  }

  if (method === "POST" && pathname === "/api/v1/workgroups") {
    const body = await readBody(req);
    return created(res, { id: 99, users: [], collections: [], ...body });
  }

  // workgroup membership mutations
  if (method === "POST" && pathname.startsWith("/api/v1/workgroups")) {
    return ok(res, {});
  }

  // -------------------------------------------------------------------------
  // Users (admin)
  // -------------------------------------------------------------------------
  if (method === "GET" && pathname === "/api/v1/users") {
    return json(res, 200, fixture("users"));
  }

  if (method === "GET" && pathname.startsWith("/api/v1/users")) {
    return json(res, 200, fixture("users"));
  }

  // -------------------------------------------------------------------------
  // Tasks
  // -------------------------------------------------------------------------
  if (method === "GET" && pathname === "/api/v1/tasks") {
    return json(res, 200, fixture("tasks"));
  }

  {
    const params = matchRoute("/api/v1/task/:pid", pathname);
    if (method === "GET" && params) {
      return ok(res, fixture("tasks").data[0]);
    }
  }

  {
    const params = matchRoute("/api/v1/task/:pid/status", pathname);
    if (method === "GET" && params) {
      return ok(res, { status: "completed" });
    }
  }

  {
    const params = matchRoute("/api/v1/task/re-run/:id", pathname);
    if (method === "POST" && params) {
      return ok(res, fixture("tasks").data[0]);
    }
  }

  {
    const params = matchRoute("/api/v1/task/:pid/cancel", pathname);
    if (method === "POST" && params) {
      return ok(res, {});
    }
  }

  // -------------------------------------------------------------------------
  // Fallthrough – return 404 so tests fail loudly on missing routes
  // -------------------------------------------------------------------------
  console.warn(`[mock-server] Unhandled ${method} ${pathname}`);
  json(res, 404, { message: `Not found: ${method} ${pathname}` });
}

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
const server = http.createServer((req, res) => {
  handle(req, res).catch((err) => {
    console.error("[mock-server] Error:", err);
    json(res, 500, { message: "Internal mock server error" });
  });
});

server.listen(PORT, () => {
  console.log(`[mock-server] Listening on http://localhost:${PORT}`);
});

process.on("SIGTERM", () => server.close());
process.on("SIGINT", () => server.close());
