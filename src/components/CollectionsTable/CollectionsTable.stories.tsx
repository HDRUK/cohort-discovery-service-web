import type { Meta, StoryObj } from "@storybook/nextjs";
import CollectionsTable from ".";

const meta: Meta<typeof CollectionsTable> = {
  title: "Components/CollectionsTable",
  component: CollectionsTable,
};

export default meta;

type Story = StoryObj<typeof CollectionsTable>;

export const Default: Story = {};
