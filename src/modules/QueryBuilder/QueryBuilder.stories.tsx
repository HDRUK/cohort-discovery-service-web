import type { Meta, StoryObj } from "@storybook/nextjs";
import QueryBuilder from "./QueryBuilder";

const meta: Meta<typeof QueryBuilder> = {
  title: "Modules/QueryBuilder",
  component: QueryBuilder,
};

export default meta;

type Story = StoryObj<typeof QueryBuilder>;

export const Default: Story = {};
