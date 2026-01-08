import type { Meta, StoryObj } from "@storybook/nextjs";
import RuleOperator from "./RuleOperator";

import MockDaphneStore from "@/store/MockDaphneStore";
import { CombinatorType, OperatorType } from "@/types/rules";

const mockOperator: OperatorType = {
  id: "o1",
  combinator: CombinatorType.AND,
};

const meta: Meta<typeof RuleOperator> = {
  title: "Modules/RuleOperator",
  component: RuleOperator,
  args: {
    operator: mockOperator,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "1rem" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof RuleOperator>;

const operators: OperatorType[] = [
  { id: "o1", combinator: CombinatorType.AND },
  { id: "o2", combinator: CombinatorType.OR },
  { id: "o3", combinator: CombinatorType.FOLLOWED_BY },
];

export const Default: Story = {
  render: () => (
    <MockDaphneStore>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {operators.map((op) => (
          <RuleOperator key={op.id} operator={op} groupId="g1" />
        ))}
      </div>
    </MockDaphneStore>
  ),
};
export const InvalidRule: Story = {
  args: {
    operator: {
      ...mockOperator,
      valid: false,
    },
  },
};
