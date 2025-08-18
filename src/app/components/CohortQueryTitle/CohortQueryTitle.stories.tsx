import type { Meta, StoryObj } from "@storybook/nextjs";
import CohortQueryInput from "../CohortQueryInput";

const meta: Meta<typeof CohortQueryInput> = {
  title: "Components/CohortQueryInput",
  component: CohortQueryInput,
};

export default meta;

type Story = StoryObj<typeof CohortQueryInput>;

export const Default: Story = {};
