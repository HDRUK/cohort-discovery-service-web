import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Collections from "./Collections";
import getCollections from "@/actions/getCollections";
jest.mock("@/actions/getCollections");

describe("Collections", () => {
  it('displays "No records to display" when collections is empty', () => {
    render(<Collections collections={[]} />);

    const noRecordsText = screen.getByText(/no records to display/i);
    expect(noRecordsText).toBeInTheDocument();
  });

  it("renders the correct column headers", () => {
    render(<Collections collections={[]} />);

    const columns = [
      "Collection ID",
      "Name",
      "Type",
      "Size",
      "Males",
      "Females",
    ];
    for (const column of columns) {
      expect(
        screen.getByRole("columnheader", { name: column })
      ).toBeInTheDocument();
    }
  });

  it("displays data when collections exist", async () => {
    const collections = await getCollections();

    render(<Collections collections={collections.data} />);

    expect(screen.getByText("Test Dataset #1")).toBeInTheDocument();
    expect(screen.getByText("Test Dataset #2")).toBeInTheDocument();

    expect(screen.getAllByText("bunny")).toHaveLength(2);

    expect(screen.getByText("1,213")).toBeInTheDocument();
    expect(screen.getByText("603")).toBeInTheDocument();
  });
});
