import type { JSONSchemaDocument } from "@hdruk/gwdm-view";
import { getCollectionLink, personalDataPaths } from "../collectionMetadata";

const QUERY_PID = "9b2f4c1e-0000-4000-8000-000000000001";
const COLLECTION_PID = "2c1d7a3e-0000-4000-8000-000000000002";

const linkArgs = (
  overrides: Partial<Parameters<typeof getCollectionLink>[0]> = {},
) => ({
  pid: COLLECTION_PID,
  url: "https://example.org/diabetes",
  queryPid: QUERY_PID,
  standalone: false,
  ...overrides,
});

describe("getCollectionLink", () => {
  it("links to the landing page in standalone mode", () => {
    expect(getCollectionLink(linkArgs({ standalone: true }))).toEqual({
      href: `/collections/${COLLECTION_PID}`,
      external: false,
    });
  });

  it("links to the landing page in standalone mode even without a url", () => {
    expect(
      getCollectionLink(linkArgs({ standalone: true, url: null })),
    ).toEqual({ href: `/collections/${COLLECTION_PID}`, external: false });
  });

  it("links to the external url with the query as ref in integrated mode", () => {
    expect(getCollectionLink(linkArgs())).toEqual({
      href: `https://example.org/diabetes?ref=${QUERY_PID}`,
      external: true,
    });
  });

  it("gives no link in integrated mode when the collection has no url", () => {
    expect(getCollectionLink(linkArgs({ url: null }))).toBeNull();
  });
});

const PERSONAL_SCHEMA: JSONSchemaDocument = {
  type: "object",
  properties: {
    summary: {
      type: "object",
      properties: {
        name: { type: "string" },
        contactPoint: { type: "string", personalData: true },
      },
    },
    access: {
      type: "object",
      properties: {
        lead: {
          type: "object",
          properties: {
            email: { type: "string", personalData: true },
            role: { type: "string" },
          },
        },
      },
    },
    owner: { type: "string", personalData: true },
  },
};

describe("personalDataPaths", () => {
  it("lists every field marked as personal data by its dotted path", () => {
    expect(personalDataPaths(PERSONAL_SCHEMA)).toEqual([
      "summary.contactPoint",
      "access.lead.email",
      "owner",
    ]);
  });

  it("returns nothing for a schema without personal data", () => {
    expect(
      personalDataPaths({
        type: "object",
        properties: { name: { type: "string" } },
      }),
    ).toEqual([]);
  });
});
