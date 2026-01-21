import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import CollectionsTable, { CollectionsTableProps } from "./CollectionsTable";
import getCustodianCollections from "@/actions/getCustodianCollections";
import MockDaphneStore from "@/store/MockDaphneStore";
jest.mock("@/actions/getCustodianCollections");

describe("CollectionsTable", () => {
  const renderCollectionsTable = (props: CollectionsTableProps) =>
    render(
      <MockDaphneStore>
        <CollectionsTable {...props} />
      </MockDaphneStore>,
    );

  it("renders the correct column headers", async () => {
    const collections = await getCustodianCollections("abc");

    renderCollectionsTable({ initialData: collections.data });

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

  it("displays data when collections exist", async () => {
    const collections = await getCustodianCollections("abc");

    renderCollectionsTable({ initialData: collections.data });

    expect(screen.getByText("Test Dataset #1")).toBeInTheDocument();
    expect(screen.getByText("Test Dataset #2")).toBeInTheDocument();
  });
});
