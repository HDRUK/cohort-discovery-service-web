import { render, screen } from "@testing-library/react";
import RuleAgeSelector, { RuleAgeSelectorProps } from "../RuleAgeSelector";
import MockCohortDiscoveryServiceStore from "@/store/MockCohortDiscoveryServiceStore";
import { createAgeFilter, createRuleGroup } from "@/utils/rules";
import { MAX_AGE_FILTER } from "@/config/rules";

beforeEach(() => {
  jest.clearAllMocks();
});

const setQueryBuilderJson = jest.fn();

const renderComponent = (
  props: Partial<RuleAgeSelectorProps>,
  flagOn: boolean,
) =>
  render(
    <MockCohortDiscoveryServiceStore
      overrides={{
        featureFlags: { flags: { "constrain-for-bunny-v1": flagOn } },
        queryBuilder: {
          queryBuilderJson: createRuleGroup(),
          setQueryBuilderJson,
          setSelectedGuidance: jest.fn(),
          selected: {},
        },
      }}
    >
      <RuleAgeSelector rule={createAgeFilter()} {...props} />
    </MockCohortDiscoveryServiceStore>,
  );

describe("RuleAgeSelector", () => {
  describe("when constrainForBunnyV1 is off", () => {
    it("renders the slider in edit mode", () => {
      renderComponent({ readOnly: false }, false);
      expect(screen.getAllByRole("slider")).toHaveLength(2);
      expect(screen.queryByText("Years")).not.toBeInTheDocument();
    });

    it("renders the read-only label when readOnly is true", () => {
      renderComponent({ readOnly: true }, false);
      expect(screen.getByText("Any age")).toBeInTheDocument();
      expect(screen.queryAllByRole("slider")).toHaveLength(0);
    });
  });

  describe("when constrainForBunnyV1 is on", () => {
    it("renders the SingleBound path in edit mode", () => {
      // Pass a rule with a non-default lower bound so SingleBoundSelector
      // renders the constraint input rather than staying in "Any age" mode.
      const ruleWithConstraint = { ...createAgeFilter(), age: [18, MAX_AGE_FILTER] as [number, number] };
      renderComponent({ readOnly: false, rule: ruleWithConstraint }, true);
      expect(screen.getByText("Years")).toBeInTheDocument();
      expect(screen.queryAllByRole("slider")).toHaveLength(0);
    });

    it("renders the read-only label when readOnly is true", () => {
      renderComponent({ readOnly: true }, true);
      expect(screen.getByText("Any age")).toBeInTheDocument();
      expect(screen.queryByText("Years")).not.toBeInTheDocument();
      expect(screen.queryAllByRole("slider")).toHaveLength(0);
    });

    it("falls back to the slider when overrideConstrainForBunny is true", () => {
      renderComponent({ readOnly: false, overrideConstrainForBunny: true }, true);
      expect(screen.getAllByRole("slider")).toHaveLength(2);
      expect(screen.queryByText("Years")).not.toBeInTheDocument();
    });
  });
});
