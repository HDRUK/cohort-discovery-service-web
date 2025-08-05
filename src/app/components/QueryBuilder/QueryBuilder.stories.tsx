import type { Meta, StoryObj, Decorator } from "@storybook/nextjs";
import QueryBuilder from "./QueryBuilder";
import ThemeRegistry from "../ThemeRegistry";

const StoreDecorator: Decorator = (Story) => {
  return (
    <ThemeRegistry>
      <Story />
    </ThemeRegistry>
  );
};

const meta: Meta<typeof QueryBuilder> = {
  title: "Components/QueryBuilder",
  component: QueryBuilder,
  decorators: [StoreDecorator],
};

export default meta;

type Story = StoryObj<typeof QueryBuilder>;

export const Default: Story = {};
