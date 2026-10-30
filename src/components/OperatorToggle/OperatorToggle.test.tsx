import { render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import OperatorToggle from "./OperatorToggle";
import MockCohortDiscoveryServiceStore from "@/store/MockCohortDiscoveryServiceStore";
import { OperatorMode, SingleSidedOperator } from "@/types/rules";

const operators = [
  SingleSidedOperator.GREATER_THAN,
  SingleSidedOperator.LESS_THAN,
] as const;

const renderComponent = (
  props: Partial<React.ComponentProps<typeof OperatorToggle>> = {},
) => {
  const onChange = jest.fn();
  render(
    <MockCohortDiscoveryServiceStore>
      <OperatorToggle
        operators={operators}
        operator={SingleSidedOperator.GREATER_THAN}
        onChange={onChange}
        {...props}
      />
    </MockCohortDiscoveryServiceStore>,
  );
  return { onChange };
};

// Keyed by OperatorMode so adding a new mode fails type-checking (and the
// coverage test below) until its behaviour is described here.
const modeCases: Record<
  OperatorMode,
  {
    buttonName: string;
    selectAlternative: (user: UserEvent, onChange: jest.Mock) => Promise<void>;
  }
> = {
  [OperatorMode.INSTANT]: {
    buttonName: "Toggle operator",
    selectAlternative: async (user) => {
      await user.click(screen.getByRole("button", { name: "Toggle operator" }));
    },
  },
  [OperatorMode.DROPDOWN]: {
    buttonName: "Change operator",
    selectAlternative: async (user, onChange) => {
      const trigger = screen.getByRole("button", { name: "Change operator" });
      await user.click(trigger);

      expect(onChange).not.toHaveBeenCalled();
      expect(trigger).toHaveAttribute("aria-expanded", "true");

      await user.click(
        screen.getByRole("button", { name: SingleSidedOperator.LESS_THAN }),
      );
    },
  },
};

describe("OperatorToggle", () => {
  it("has a test case for every OperatorMode", () => {
    expect(Object.keys(modeCases).sort()).toEqual(
      Object.values(OperatorMode).sort(),
    );
  });

  it("defaults to dropdown mode", () => {
    renderComponent();

    expect(
      screen.getByRole("button", {
        name: modeCases[OperatorMode.DROPDOWN].buttonName,
      }),
    ).toBeInTheDocument();
  });

  describe.each(Object.values(OperatorMode))("%s mode", (mode) => {
    const { buttonName, selectAlternative } = modeCases[mode];

    it("shows the current operator", () => {
      renderComponent({ mode });

      expect(
        screen.getByRole("button", { name: buttonName }),
      ).toHaveTextContent(SingleSidedOperator.GREATER_THAN);
    });

    it("calls onChange with the alternative operator", async () => {
      const user = userEvent.setup();
      const { onChange } = renderComponent({ mode });

      await selectAlternative(user, onChange);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(SingleSidedOperator.LESS_THAN);
    });

    it("is disabled when readOnly", () => {
      renderComponent({ mode, readOnly: true });

      expect(screen.getByRole("button", { name: buttonName })).toBeDisabled();
    });
  });
});
