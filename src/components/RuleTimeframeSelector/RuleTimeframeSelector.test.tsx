import { render, screen, within } from "@testing-library/react";
import RuleTimeframeSelector, {
  RuleTimeframeSelectorProps,
} from "./RuleTimeframeSelector";
import MockDaphneStore from "@/store/MockDaphneStore";
import dayjs from "dayjs";

beforeEach(() => {
  jest.clearAllMocks();
});

const renderComponent = (props: RuleTimeframeSelectorProps) =>
  render(
    <MockDaphneStore>
      <RuleTimeframeSelector {...props} />
    </MockDaphneStore>,
  );

describe("RuleTimeframeSelector", () => {
  const baseRule = {
    id: "base-rule-id",
    exclude: false,
    rule: {
      concept: {
        concept_id: 443597,
        name: "Chronic kidney disease stage 3",
        category: "Condition",
      },
    },
  };

  it("returns null when rule.timeConstraint is not set", () => {
    renderComponent({ rule: baseRule, label: "Test" });

    expect(
      screen.queryByTestId("rule-timeframe-selector"),
    ).not.toBeInTheDocument();
  });

  it("renders two DatePickers with values derived from rule.timeConstraint", () => {
    const startIso = "2026-01-01T00:00:00.000Z";
    const endIso = "2026-06-01T00:00:00.000Z";

    renderComponent({
      rule: { ...baseRule, timeConstraint: [startIso, endIso] },
      label: "Test",
    });
    const groups = screen.getAllByRole("group", { name: "Test" });
    expect(groups).toHaveLength(2);

    const [startGroup, endGroup] = groups;

    const expectedStartMonth = dayjs(startIso).format("MM");
    const expectedStartYear = dayjs(startIso).format("YYYY");
    const expectedEndMonth = dayjs(endIso).format("MM");
    const expectedEndYear = dayjs(endIso).format("YYYY");

    const startMonthSpinbutton = within(startGroup).getByRole("spinbutton", {
      name: "Month",
    });
    const startYearSpinbutton = within(startGroup).getByRole("spinbutton", {
      name: "Year",
    });

    expect(startMonthSpinbutton).toHaveTextContent(expectedStartMonth);
    expect(startYearSpinbutton).toHaveTextContent(expectedStartYear);

    const endMonthSpinbutton = within(endGroup).getByRole("spinbutton", {
      name: "Month",
    });
    const endYearSpinbutton = within(endGroup).getByRole("spinbutton", {
      name: "Year",
    });

    expect(endMonthSpinbutton).toHaveTextContent(expectedEndMonth);
    expect(endYearSpinbutton).toHaveTextContent(expectedEndYear);
  });
});
