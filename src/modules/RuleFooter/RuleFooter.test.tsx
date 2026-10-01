import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RuleFooter from "./RuleFooter";

describe("RuleFooter", () => {
  it("renders the message and both buttons in the same row", () => {
    render(
      <RuleFooter
        message="Please confirm or clear your changes before continuing"
        onConfirm={jest.fn()}
        onClearAll={jest.fn()}
      />,
    );

    const footer = screen.getByTestId("rule-footer");
    expect(
      within(footer).getByText(/please confirm or clear your changes/i),
    ).toBeInTheDocument();
    expect(
      within(footer).getByRole("button", { name: /confirm selection/i }),
    ).toBeInTheDocument();
    expect(
      within(footer).getByRole("button", { name: /clear all/i }),
    ).toBeInTheDocument();
  });

  it("renders the invalid reasons and both buttons in the same row", () => {
    render(
      <RuleFooter
        invalidReason={["A rule cannot be empty."]}
        onConfirm={jest.fn()}
        onClearAll={jest.fn()}
      />,
    );

    const footer = screen.getByTestId("rule-footer");
    expect(
      within(footer).getByText("A rule cannot be empty."),
    ).toBeInTheDocument();
    expect(
      within(footer).getByRole("button", { name: /confirm selection/i }),
    ).toBeInTheDocument();
    expect(
      within(footer).getByRole("button", { name: /clear all/i }),
    ).toBeInTheDocument();
  });

  it("prefers the message over the invalid reasons when both are given", () => {
    render(
      <RuleFooter
        message="Please confirm or clear your changes before continuing"
        invalidReason={["A rule cannot be empty."]}
      />,
    );

    expect(
      screen.queryByText("A rule cannot be empty."),
    ).not.toBeInTheDocument();
  });

  it("renders no buttons when there is nothing to confirm", () => {
    render(<RuleFooter invalidReason={["A rule cannot be empty."]} />);

    expect(
      screen.getByText("A rule cannot be empty."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("disables Confirm selection when confirmDisabled is set", () => {
    render(
      <RuleFooter message="Pick something" onConfirm={jest.fn()} confirmDisabled />,
    );

    expect(
      screen.getByRole("button", { name: /confirm selection/i }),
    ).toBeDisabled();
  });

  it("calls the handlers without bubbling the click to the card", async () => {
    const onConfirm = jest.fn();
    const onClearAll = jest.fn();
    const onCardClick = jest.fn();

    render(
      <div onClick={onCardClick}>
        <RuleFooter
          message="Pick something"
          onConfirm={onConfirm}
          onClearAll={onClearAll}
        />
      </div>,
    );

    await userEvent.click(
      screen.getByRole("button", { name: /clear all/i }),
    );
    await userEvent.click(
      screen.getByRole("button", { name: /confirm selection/i }),
    );

    expect(onClearAll).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCardClick).not.toHaveBeenCalled();
  });
});
