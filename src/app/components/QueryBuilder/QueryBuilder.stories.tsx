import type { Meta, StoryObj } from "@storybook/nextjs";
import QueryBuilder from "./QueryBuilder";
import { useDaphneStore } from "@/store/useDaphneStore";
import ThemeRegistry from "../ThemeRegistry";

// Mock data
const mockFields = [
  { name: "firstName", label: "First Name" },
  { name: "age", label: "Age" },
  { name: "isActive", label: "Is Active" },
];

const mockQuery = {
  combinator: "and",
  rules: [
    {
      field: "firstName",
      operator: "=",
      value: "John",
    },
  ],
};

const StoreDecorator = (Story: any) => {
  useDaphneStore.setState({
    fields: mockFields,
    queryBuilderJson: mockQuery,
    setQueryBuilderJson: () => {},
    isLoading: false,
  });

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
