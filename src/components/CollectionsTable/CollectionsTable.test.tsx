import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import CollectionsTable, { CollectionsTableProps } from "./CollectionsTable";
import { CollectionListProvider } from "@/contexts/CollectionListContext";
import { getMockCustodianCollections } from "@/test/fixtures/collections";
import { getMockCustodian } from "@/test/fixtures/custodians";
import MockCohortDiscoveryServiceStore from "@/store/MockCohortDiscoveryServiceStore";
import { CollectionWithHosts, Paginated } from "@/types/api";

let mockSearchParams = new URLSearchParams();

jest.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
  usePathname: () => "/admin/collections",
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

describe("CollectionsTable", () => {
  beforeEach(() => {
    mockSearchParams = new URLSearchParams();
  });

  const renderCollectionsTableAdmin = (
    collections: Paginated<CollectionWithHosts>,
    props?: CollectionsTableProps,
  ) =>
    render(
      <MockCohortDiscoveryServiceStore>
        <CollectionListProvider collections={collections}>
          <CollectionsTable {...props} />
        </CollectionListProvider>
      </MockCohortDiscoveryServiceStore>,
    );

  const renderCollectionsTable = (
    collections: Paginated<CollectionWithHosts>,
    props?: CollectionsTableProps,
  ) =>
    render(
      <MockCohortDiscoveryServiceStore
        overrides={{
          custodianSection: {
            custodian: getMockCustodian(),
          },
        }}
      >
        <CollectionListProvider collections={collections}>
          <CollectionsTable {...props} />
        </CollectionListProvider>
      </MockCohortDiscoveryServiceStore>,
    );

  it("renders the correct column headers for admin", async () => {
    const collections = await getMockCustodianCollections();

    renderCollectionsTableAdmin(collections.data);

    const columns = [
      "Name",
      "Last Ping",
      "Last Query",
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

  it("marks the table busy until the collections have loaded", () => {
    render(
      <MockCohortDiscoveryServiceStore>
        <CollectionsTable />
      </MockCohortDiscoveryServiceStore>,
    );

    expect(document.querySelector('tbody[aria-busy="true"]')).not.toBeNull();
    expect(screen.queryByText("Test Dataset #1")).not.toBeInTheDocument();
  });

  it("displays data when collections exist for admin", async () => {
    const collections = await getMockCustodianCollections();

    renderCollectionsTableAdmin(collections.data);

    expect(screen.getByText("Test Dataset #1")).toBeInTheDocument();
    expect(screen.getByText("Test Dataset #2")).toBeInTheDocument();
  });

  it("displays data when collections exist for custodian", async () => {
    const collections = await getMockCustodianCollections();

    renderCollectionsTable(collections.data);

    expect(screen.getByText("Test Dataset #1")).toBeInTheDocument();
    expect(screen.getByText("Test Dataset #2")).toBeInTheDocument();
  });

  it("shows a deleted chip in place of the state for a deleted collection", async () => {
    const collections = await getMockCustodianCollections();
    const [deleted, ...live] = collections.data.data;

    renderCollectionsTableAdmin({
      ...collections.data,
      data: [{ ...deleted, deleted_at: "2026-10-01T00:00:00Z" }, ...live],
    });

    expect(screen.getAllByText("Deleted")).toHaveLength(1);
  });

  it("shows the delete button outside the deleted view", async () => {
    const collections = await getMockCustodianCollections();

    renderCollectionsTableAdmin(collections.data);

    expect(screen.getByTestId("DeleteIcon")).toBeInTheDocument();
  });

  it("swaps delete for restore on the deleted view", async () => {
    mockSearchParams = new URLSearchParams("collection_filter=deleted");
    const collections = await getMockCustodianCollections();

    renderCollectionsTableAdmin(collections.data);

    expect(screen.queryByTestId("DeleteIcon")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Restore" })).toBeInTheDocument();
  });

  it("shows no restore button outside the deleted view", async () => {
    const collections = await getMockCustodianCollections();

    renderCollectionsTableAdmin(collections.data);

    expect(
      screen.queryByRole("button", { name: "Restore" }),
    ).not.toBeInTheDocument();
  });
});
