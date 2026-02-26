import type { Meta, StoryObj } from "@storybook/nextjs";
import TaskResults from "./TaskResults";
import { mockTasks } from "@/actions/task/__mocks__/getTasks";

const meta: Meta<typeof TaskResults> = {
  title: "Components/TaskResults",
  component: TaskResults,
};

export default meta;

type Story = StoryObj<typeof TaskResults>;

export const Default: Story = {
  render: () => <TaskResults tasks={mockTasks} />,
};
