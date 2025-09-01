import type { Meta, StoryObj } from "@storybook/nextjs";
import Collections from "../Collections";

const meta: Meta<typeof Collections> = {
  title: "Components/Collections",
  component: Collections,
};

export default meta;

type Story = StoryObj<typeof Collections>;

export const Default: Story = {};
