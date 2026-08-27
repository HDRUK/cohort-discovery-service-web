import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddressSearch from "./AddressSearch";

describe("AddressSearch", () => {
  it("reflects an externally-changed value prop, e.g. after a map pin drop", () => {
    const { rerender } = render(<AddressSearch onSelect={jest.fn()} value="" />);

    const input = screen.getByPlaceholderText(
      /search by address, postcode or location/i,
    ) as HTMLInputElement;
    expect(input.value).toBe("");

    rerender(<AddressSearch onSelect={jest.fn()} value="51.5074, -0.1278" />);

    expect(input.value).toBe("51.5074, -0.1278");
  });

  it("does not call onSelect when free text is typed without picking a suggestion", async () => {
    const onSelect = jest.fn();
    const user = userEvent.setup();
    render(<AddressSearch onSelect={onSelect} value="" />);

    const input = screen.getByPlaceholderText(
      /search by address, postcode or location/i,
    );
    await user.type(input, "not a real place{enter}");

    expect(onSelect).not.toHaveBeenCalled();
  });
});
