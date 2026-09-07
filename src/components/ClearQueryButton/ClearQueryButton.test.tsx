import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DEFAULT_QUERY, useQueryBuilderStore } from "@/store/queryBuilderStore";
import ClearQueryButton from "./ClearQueryButton";

const store = () => useQueryBuilderStore.getState();

const clearButton = () => screen.getByRole("button", { name: /clear query/i });

describe("ClearQueryButton", () => {
  beforeEach(() => {
    store().setQueryBuilderJson(DEFAULT_QUERY);
  });

  it("is inert when the query has neither rules nor demographics", () => {
    render(<ClearQueryButton />);

    expect(clearButton()).toHaveStyle({ pointerEvents: "none" });
  });

  it("clears a demographics-only query", async () => {
    store().addDemographics();
    render(<ClearQueryButton />);

    expect(clearButton()).toHaveStyle({ pointerEvents: "auto" });

    await userEvent.click(clearButton());

    expect(store().queryBuilderJson.demographics).toBeUndefined();
  });
});
