import { render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { useMediaQuery } from "@mui/material";
import SingleBoundSelector from "./SingleBoundSelector";
import MockCohortDiscoveryServiceStore from "@/store/MockCohortDiscoveryServiceStore";
import { OperatorMode, SingleSidedOperator } from "@/types/rules";

jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  useMediaQuery: jest.fn(),
}));

const mockUseMediaQuery = useMediaQuery as jest.Mock;

const renderComponent = () => {
  const onConstraintChange = jest.fn();
  render(
    <MockCohortDiscoveryServiceStore>
      <SingleBoundSelector<number>
        constraint={[18, null]}
        constraintOperator={SingleSidedOperator.GREATER_THAN}
        onConstraintChange={onConstraintChange}
        renderPicker={() => <input aria-label="value" />}
      />
    </MockCohortDiscoveryServiceStore>,
  );
  return { onConstraintChange };
};

// Which OperatorMode each screen size should use, and the accessible name of
// the button that mode renders. Keyed by OperatorMode so a new mode can't be
// added without deciding how SingleBoundSelector should handle it.
const modeCases: Record<
  OperatorMode,
  {
    isXl: boolean;
    buttonName: string;
    selectAlternative: (user: UserEvent) => Promise<void>;
  }
> = {
  [OperatorMode.INSTANT]: {
    isXl: true,
    buttonName: "Toggle operator",
    selectAlternative: async (user) => {
      await user.click(screen.getByRole("button", { name: "Toggle operator" }));
    },
  },
  [OperatorMode.DROPDOWN]: {
    isXl: false,
    buttonName: "Change operator",
    selectAlternative: async (user) => {
      await user.click(screen.getByRole("button", { name: "Change operator" }));
      await user.click(
        screen.getByRole("button", { name: SingleSidedOperator.LESS_THAN }),
      );
    },
  },
};

describe("SingleBoundSelector", () => {
  it("has a test case for every OperatorMode", () => {
    expect(Object.keys(modeCases).sort()).toEqual(
      Object.values(OperatorMode).sort(),
    );
  });

  describe.each(Object.values(OperatorMode))("%s mode", (mode) => {
    const { isXl, buttonName, selectAlternative } = modeCases[mode];

    beforeEach(() => {
      mockUseMediaQuery.mockReturnValue(isXl);
    });

    it(`is used when isXl is ${isXl}`, () => {
      renderComponent();

      expect(
        screen.getByRole("button", { name: buttonName }),
      ).toBeInTheDocument();
    });

    it("moves the value to the other side when the operator changes", async () => {
      const user = userEvent.setup();
      const { onConstraintChange } = renderComponent();

      await selectAlternative(user);

      expect(onConstraintChange).toHaveBeenCalledWith(
        [null, 18],
        SingleSidedOperator.LESS_THAN,
      );
    });
  });
});
