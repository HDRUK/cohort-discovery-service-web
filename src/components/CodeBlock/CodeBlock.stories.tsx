import type { Meta, StoryObj } from "@storybook/nextjs";
import CodeBlock from "./CodeBlock";

const meta: Meta<typeof CodeBlock> = {
  title: "Components/CodeBlock",
  component: CodeBlock,
};

export default meta;

type Story = StoryObj<typeof CodeBlock>;

export const Default: Story = {
  args: {
    code: {
      name: "John Doe",
      email: "john.doe@example.com",
      active: true,
      roles: ["admin", "editor"],
    },
  },
};
