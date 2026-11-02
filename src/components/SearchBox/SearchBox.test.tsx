import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBox, { SearchBoxProps } from "./SearchBox";
import { DefaultProvider } from "@/providers/DefaultProvider";

const renderComponent = (props: Partial<SearchBoxProps> = {}) =>
  render(
    <DefaultProvider>
      <SearchBox collapsible={false} {...props} />
    </DefaultProvider>,
  );

const clearButton = () => screen.queryByRole("button", { name: "Clear search" });
const submitButton = () =>
  screen.queryByRole("button", { name: "Submit search" });

describe("SearchBox clear button", () => {
  it("only offers to clear once there is text to clear", async () => {
    renderComponent({ onClear: jest.fn() });

    expect(clearButton()).not.toBeInTheDocument();
    expect(submitButton()).toBeInTheDocument();

    await userEvent.type(screen.getByRole("searchbox"), "asthma");

    expect(clearButton()).toBeInTheDocument();
    expect(submitButton()).not.toBeInTheDocument();
  });

  it("empties the input, tells the parent, and brings the search icon back", async () => {
    const onClear = jest.fn();
    renderComponent({ onClear });
    const input = screen.getByRole("searchbox");

    await userEvent.type(input, "asthma");
    await userEvent.click(clearButton()!);

    expect(input).toHaveValue("");
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(submitButton()).toBeInTheDocument();
  });

  it("keeps the submit button for callers that don't opt in, so they can still submit with text entered", async () => {
    const onClickEndAdornment = jest.fn();
    renderComponent({ onClickEndAdornment });

    await userEvent.type(screen.getByRole("searchbox"), "asthma");

    expect(clearButton()).not.toBeInTheDocument();
    await userEvent.click(submitButton()!);
    expect(onClickEndAdornment).toHaveBeenCalledTimes(1);
  });

  it("shows the clear button for a controlled value and leaves resetting it to the parent", async () => {
    const onClear = jest.fn();
    renderComponent({ value: "asthma", onClear, onChange: jest.fn() });

    await userEvent.click(clearButton()!);

    expect(onClear).toHaveBeenCalledTimes(1);
    // The parent owns the value, so it stays until the parent updates it.
    expect(screen.getByRole("searchbox")).toHaveValue("asthma");
  });

  it("does not clear when the search action is disabled", async () => {
    const onClear = jest.fn();
    renderComponent({ defaultValue: "asthma", onClear, disabled: true });

    expect(clearButton()).toBeDisabled();
    // Force the click past `pointer-events: none` to check the handler ignores it too.
    await userEvent.setup({ pointerEventsCheck: 0 }).click(clearButton()!);

    expect(onClear).not.toHaveBeenCalled();
    expect(screen.getByRole("searchbox")).toHaveValue("asthma");
  });
});
