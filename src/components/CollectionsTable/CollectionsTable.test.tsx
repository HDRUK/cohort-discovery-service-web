import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import CollectionsTable, { CollectionsTableProps } from "./CollectionsTable";
import getCustodianCollections from "@/actions/collection/getCustodianCollections";
import getCustodian from "@/actions/custodian/getCustodian";
import MockCohortDiscoveryServiceStore from "@/store/MockCohortDiscoveryServiceStore";
import { CollectionWithHosts, Paginated } from "@/types/api";
jest.mock("@/actions/collection/getCustodianCollections");
jest.mock("@/actions/collection/getCollectionDetails");
jest.mock("@/actions/custodian/getCustodian");

describe("CollectionsTable", () => {
  const renderCollectionsTableAdmin = (
    collections: Paginated<CollectionWithHosts>,
    props?: CollectionsTableProps,
  ) =>
    render(
      <MockCohortDiscoveryServiceStore
        overrides={{
          admin: {
            collections,
          },
        }}
      >
        <CollectionsTable {...props} />
      </MockCohortDiscoveryServiceStore>,
    );

  const renderCollectionsTable = (
    collections: Paginated<CollectionWithHosts>,
    props?: CollectionsTableProps,
  ) =>
    render(
      <MockCohortDiscoveryServiceStore
        overrides={{
          custodian: {
            current: {
              custodian: getCustodian(),
              collections,
            },
          },
        }}
      >
        <CollectionsTable {...props} />
      </MockCohortDiscoveryServiceStore>,
    );

  it("renders the correct column headers for admin", async () => {
    const collections = await getCustodianCollections("abc");

    renderCollectionsTableAdmin(collections.data);

    const columns = [
      "Name",
      "Last Ping",
      "Last Distribution Demographics",
      "Last Distribution Concepts",
      "Status",
    ];
    for (const column of columns) {
      expect(
        screen.getByRole("columnheader", { name: column }),
      ).toBeInTheDocument();
    }
  });

  it("displays data when collections exist for admin", async () => {
    const collections = await getCustodianCollections("abc");

    renderCollectionsTableAdmin(collections.data);

    expect(screen.getByText("Test Dataset #1")).toBeInTheDocument();
    expect(screen.getByText("Test Dataset #2")).toBeInTheDocument();
  });

  it("displays data when collections exist for custodian", async () => {
    const collections = await getCustodianCollections("abc");

    renderCollectionsTable(collections.data);

    expect(screen.getByText("Test Dataset #1")).toBeInTheDocument();
    expect(screen.getByText("Test Dataset #2")).toBeInTheDocument();
  });
});
