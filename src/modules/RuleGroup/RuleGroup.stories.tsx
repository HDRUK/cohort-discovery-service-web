import type { Meta, StoryObj } from "@storybook/nextjs";
import RuleGroup from "./RuleGroup";

import {
  CombinatorType,
  OperatorType,
  RuleGroupType,
  RuleLeafType,
} from "@/types/rules";
import { Concept } from "@/types/api";

const mockConcept1: Concept = {
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

const mockConcept2: Concept = {
  concept_id: 4321,
  description: "COPD",
  category: "Condition",
};

const mockRule1: RuleLeafType = {
  id: "r1",
  exclude: false,
  rule: { concept: mockConcept1 },
};

const mockOperator: OperatorType = {
  id: "o1",
  combinator: CombinatorType.AND,
};

const mockRule2: RuleLeafType = {
  id: "r2",
  exclude: false,
  rule: { concept: mockConcept2 },
};

const mockGroup: RuleGroupType = {
  id: "g1",
  rules: [mockRule1, mockOperator, mockRule2],
};

const meta: Meta<typeof RuleGroup> = {
  title: "Modules/RuleGroup",
  component: RuleGroup,
  args: {
    group: mockGroup,
    parentGroupId: "group-1",
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

type Story = StoryObj<typeof RuleGroup>;

export const Default: Story = {};

export const InvalidGroup: Story = {
  args: {
    group: {
      ...mockGroup,
      valid: false,
    },
  },
};
