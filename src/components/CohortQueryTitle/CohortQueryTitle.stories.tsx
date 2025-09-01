import type { Meta, StoryObj } from "@storybook/nextjs";
import CohortQueryTitle from "../CohortQueryTitle";

const meta: Meta<typeof CohortQueryTitle> = {
  title: "Components/CohortQueryTitle",
  component: CohortQueryTitle,
};

export default meta;

type Story = StoryObj<typeof CohortQueryTitle>;

export const Default: Story = {};
