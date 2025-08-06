import type { Meta, StoryObj } from "@storybook/nextjs";
import SelectDatasets from "./SelectDatasets";

const meta: Meta<typeof SelectDatasets> = {
  title: "Components/SelectDatasets",
  component: SelectDatasets,
};

export default meta;

type Story = StoryObj<typeof SelectDatasets>;

export const Default: Story = {};
