import type { Meta, StoryObj } from "@storybook/nextjs";
import Rule from "./Rule";

import { RuleLeafType } from "@/types/rules";
import { Concept } from "@/types/api";
import MockDaphneStore from "@/store/MockDaphneStore";

const mockConcept: Concept = {
  concept_id: 1234,
  description: "Heart Disease",
  category: "Condition",
  children: [
    {
      concept_id: 12345,
      description: "Myocardial Infarction",
      category: "Condition",
    },
  ],
};

const mockRule: RuleLeafType = {
  id: "r1",
  exclude: false,
  rule: { concept: mockConcept },
};

const meta: Meta<typeof Rule> = {
  title: "Modules/Rule",
  component: Rule,
  args: {
    rule: mockRule,
    groupId: "group-1",
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

type Story = StoryObj<typeof Rule>;

export const Default: Story = {};

export const EmptyRuleThatIsSearchable: Story = {
  args: {
    rule: {
      id: "r2",
      exclude: false,
      valid: true,
      rule: { concept: null },
    },
  },
  render: (args) => (
    <MockDaphneStore>
      <Rule {...args} />
    </MockDaphneStore>
  ),
};

export const InvalidRule: Story = {
  args: {
    rule: {
      ...mockRule,
      valid: false,
    },
  },
};
