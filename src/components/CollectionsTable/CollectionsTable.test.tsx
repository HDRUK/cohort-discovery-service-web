import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import CollectionsTable, { CollectionsTableProps } from "./CollectionsTable";
import getCustodianCollections from "@/actions/collection/getCustodianCollections";
import getCustodian from "@/actions/custodian/getCustodian";
import MockDaphneStore from "@/store/MockDaphneStore";
import { CollectionWithHosts, Paginated } from "@/types/api";
jest.mock("@/actions/collection/getCustodianCollections");
jest.mock("@/actions/custodian/getCustodian");

describe("CollectionsTable", () => {
  const renderCollectionsTableAdmin = (
    collections: Paginated<CollectionWithHosts>,
    props?: CollectionsTableProps,
  ) =>
    render(
      <MockDaphneStore
        overrides={{
          admin: {
            collections,
          },
        }}
      >
        <CollectionsTable {...props} />
      </MockDaphneStore>,
    );

  const renderCollectionsTable = (
    collections: Paginated<CollectionWithHosts>,
    props?: CollectionsTableProps,
  ) =>
    render(
      <MockDaphneStore
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
      </MockDaphneStore>,
    );

  it("renders the correct column headers for admin", async () => {
    const collections = await getCustodianCollections("abc");

    renderCollectionsTableAdmin(collections.data);

    const columns = [
      "Name",
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
