import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddButton from "../AddButton";

const renderInsideClickableParent = (disabled: boolean) => {
  const onParentClick = jest.fn();
  const onClick = jest.fn();
  render(
    <div onClick={onParentClick}>
      <AddButton label="Add age" disabled={disabled} onClick={onClick} />
    </div>,
  );
  return { onParentClick, onClick };
};

describe("AddButton", () => {
  it("keeps clicks on a disabled button from reaching the parent", () => {
    const { onParentClick, onClick } = renderInsideClickableParent(true);

    fireEvent.click(screen.getByRole("button").parentElement as HTMLElement);

    expect(onParentClick).not.toHaveBeenCalled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("calls onClick when enabled", async () => {
    const { onClick } = renderInsideClickableParent(false);

    await userEvent.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
