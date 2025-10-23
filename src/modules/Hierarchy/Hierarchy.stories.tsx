import type { Meta, StoryObj } from "@storybook/nextjs";
import { Hierarchy } from "./Hierarchy";
import { DndContext } from "@dnd-kit/core";
import {
  CombinatorType,
  OperatorType,
  RuleGroupType,
  RuleLeafType,
} from "@/types/rules";
import { Concept } from "@/types/api";
import {
  restrictToWindowEdges,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";

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

const meta: Meta<typeof Hierarchy> = {
  title: "Modules/Hierarchy",
  component: Hierarchy,
  args: {
    ruleGroup: mockGroup,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "1rem" }}>
        <DndContext modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}>
          <Story />
        </DndContext>
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Hierarchy>;

export const Default: Story = {};
