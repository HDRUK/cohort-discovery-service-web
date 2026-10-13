import { render } from "@testing-library/react";
import TableSkeleton from "./TableSkeleton";

describe("TableSkeleton", () => {
  it("renders a header bar plus the requested number of row bars", () => {
    const { container } = render(<TableSkeleton rows={4} />);
    // 1 header + 4 rows = 5 skeleton bars
    expect(container.querySelectorAll(".MuiSkeleton-root")).toHaveLength(5);
  });

  it("defaults to 6 rows (7 bars incl. header)", () => {
    const { container } = render(<TableSkeleton />);
    expect(container.querySelectorAll(".MuiSkeleton-root")).toHaveLength(7);
  });
});
