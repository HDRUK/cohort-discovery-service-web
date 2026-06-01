import "@testing-library/jest-dom";
import { useState } from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchConcepts from "./SearchConcepts";
import ApplicationModeProvider from "@/providers/ApplicationModeProvider";
import { useUserDataStore, UserDataStoreState } from "@/hooks/userDataStore";
import { Concept, Paginated } from "@/types/api";
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
  const defaultSearchForConcepts =
    useUserDataStore.getState().searchForConcepts;

  afterEach(() => {
    act(() => {
      useUserDataStore.setState({
        searchForConcepts: defaultSearchForConcepts,
      });
    });
  });

  const renderComponent = (
    props?: React.ComponentProps<typeof SearchConcepts>,
    searchForConcepts?: UserDataStoreState["searchForConcepts"],
  ) => {
    if (searchForConcepts) {
      useUserDataStore.setState({ searchForConcepts });
    }

    render(<Wrapper {...props} />);
  };

  const getPagedConceptSearch =
    (total: number): UserDataStoreState["searchForConcepts"] =>
    async ({ page = 1, perPage }) => {
      const allConcepts = Array.from({ length: total }, (_, i) => ({
        concept_id: i + 1,
        name: `Paged concept ${i + 1}`,
        category: "Condition",
      })) as Concept[];

      const start = (page - 1) * perPage;
      const data = allConcepts.slice(start, start + perPage);

      return {
        data,
        from: data.length ? start + 1 : 0,
        to: start + data.length,
        current_page: page,
        per_page: perPage,
        total,
        last_page: Math.max(1, Math.ceil(total / perPage)),
      } as Paginated<Partial<Concept>>;
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

  it("keeps loading pages after 100 results and hides Show more on the final page", async () => {
    renderComponent(undefined, getPagedConceptSearch(105));

    const input = screen.getByRole("textbox");
    await userEvent.type(input, "Paged{enter}");

    expect(await screen.findAllByTestId("concept-item")).toHaveLength(20);

    for (const loadedCount of [20, 40, 60, 80, 100]) {
      const showMoreButton = await screen.findByRole("button", {
        name: `Show more (${loadedCount} / 105)`,
      });
      await waitFor(() => expect(showMoreButton).toBeEnabled());
      await userEvent.click(showMoreButton);
    }

    await waitFor(() => {
      expect(screen.getAllByTestId("concept-item")).toHaveLength(105);
    });
    expect(
      screen.queryByRole("button", { name: /show more/i }),
    ).not.toBeInTheDocument();
  });
});
