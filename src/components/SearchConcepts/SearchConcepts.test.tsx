import "@testing-library/jest-dom";
import { useState } from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchConcepts from "./SearchConcepts";
import ApplicationModeProvider from "@/providers/ApplicationModeProvider";
jest.mock("@/actions/concept/searchConcepts");

function Wrapper(props: React.ComponentProps<typeof SearchConcepts>) {
  const [selected, setSelected] = useState<Record<number, boolean>>({});
  return (
    <ApplicationModeProvider>
      <SearchConcepts
        {...props}
        selected={selected}
        setSelected={setSelected}
      />
    </ApplicationModeProvider>
  );
}

describe("SearchConcepts", () => {
  const renderComponent = (
    props?: React.ComponentProps<typeof SearchConcepts>,
  ) => {
    render(<Wrapper {...props} />);
  };

  it("displays results upon search", async () => {
    renderComponent();

    const input = screen.getByRole("textbox");
    await userEvent.type(input, "Chronic Kidney{enter}");

    const items = await screen.findAllByTestId("concept-item");
    expect(items).toHaveLength(16);
    expect(items[0]).toHaveTextContent("Chronic kidney disease stage 3");
    expect(items[1]).toHaveTextContent("Chronic kidney disease stage 5");
  });

  it("does not display results upon search if the domain is wrong", async () => {
    renderComponent({ domain: "Measurement" });

    const input = screen.getByRole("textbox");
    await userEvent.type(input, "Chronic Kidney{enter}");

    const items = screen.queryAllByTestId("concept-item");
    expect(items).toHaveLength(0);
  });

  it("when multiple=true, shows 'Select All' and toggles it on click", async () => {
    renderComponent({ multiple: true });

    const input = screen.getByRole("textbox");
    await userEvent.type(input, "Chronic Kidney{enter}");

    const items = await screen.findAllByTestId("concept-item");
    expect(items.length).toBeGreaterThan(0);

    const selectAll = screen.getByRole("checkbox", { name: /select all/i });
    expect(selectAll).not.toBeChecked();

    await userEvent.click(selectAll);
    expect(selectAll).toBeChecked();

    await userEvent.click(selectAll);
    expect(selectAll).not.toBeChecked();
  });

  it("when multiple=false, clicking a ConceptItem calls onClick with the concept", async () => {
    const onClick = jest.fn();
    renderComponent({ multiple: false, onClick });

    const input = screen.getByRole("textbox");
    await userEvent.type(input, "Chronic Kidney{enter}");

    const items = await screen.findAllByTestId("concept-item");
    expect(items.length).toBeGreaterThan(0);

    expect(screen.queryByRole("checkbox", { name: /select all/i })).toBeNull();

    const firstItem = items[0];
    await userEvent.click(firstItem);

    expect(onClick).toHaveBeenCalledTimes(1);

    const calledWith = onClick.mock.calls[0][0];
    expect(calledWith).toHaveProperty("concept_id");
    expect(calledWith).toHaveProperty("name");
  });

  it("loads more results after clicking Show more", async () => {
    renderComponent();

    const input = screen.getByRole("textbox");
    await userEvent.type(input, "Chronic{enter}");

    const initialItems = await screen.findAllByTestId("concept-item");
    expect(initialItems).toHaveLength(20);
    expect(screen.getByRole("button", { name: /show more/i })).toHaveTextContent(
      "Show more (20 / 22)",
    );

    const showMore = await screen.findByRole("button", { name: /show more/i });
    await act(async () => {
      showMore.click();
    });

    await waitFor(() => {
      expect(screen.getAllByTestId("concept-item")).toHaveLength(22);
      expect(screen.queryByRole("button", { name: /show more/i })).toBeNull();
    });
  });
});
