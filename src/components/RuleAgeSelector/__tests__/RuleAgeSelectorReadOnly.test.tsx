import { render, screen } from "@testing-library/react";
import RuleAgeSelectorReadOnly from "../RuleAgeSelectorReadOnly";
import { MAX_AGE_FILTER, MIN_AGE_FILTER } from "@/config/rules";

describe("RuleAgeSelectorReadOnly", () => {
  it('displays "Any age" when range covers the full span', () => {
    render(
      <RuleAgeSelectorReadOnly
        from={MIN_AGE_FILTER}
        to={MAX_AGE_FILTER}
        minAge={MIN_AGE_FILTER}
        maxAge={MAX_AGE_FILTER}
      />,
    );
    expect(screen.getByText("Any age")).toBeInTheDocument();
  });

  it('displays "Age < X" when lower bound is at minimum', () => {
    render(
      <RuleAgeSelectorReadOnly
        from={MIN_AGE_FILTER}
        to={65}
        minAge={MIN_AGE_FILTER}
        maxAge={MAX_AGE_FILTER}
      />,
    );
    expect(screen.getByText("Age < 65")).toBeInTheDocument();
  });

  it('displays "Age ≥ X" when upper bound is at maximum', () => {
    render(
      <RuleAgeSelectorReadOnly
        from={18}
        to={MAX_AGE_FILTER}
        minAge={MIN_AGE_FILTER}
        maxAge={MAX_AGE_FILTER}
      />,
    );
    expect(screen.getByText("Age ≥ 18")).toBeInTheDocument();
  });

  it("displays a range label for a custom age range", () => {
    render(
      <RuleAgeSelectorReadOnly
        from={18}
        to={65}
        minAge={MIN_AGE_FILTER}
        maxAge={MAX_AGE_FILTER}
      />,
    );
    expect(screen.getByText("Age 18 – 65")).toBeInTheDocument();
  });
});
