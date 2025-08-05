import type { Meta, StoryObj } from "@storybook/nextjs";
import SelectDatasets from "./SelectDatasets";
import { useState } from "react";
import { useDaphneStore } from "@/store/useDaphneStore";

const meta: Meta<typeof SelectDatasets> = {
  title: "Components/SelectDatasets",
  component: SelectDatasets,
};

export default meta;

type Story = StoryObj<typeof SelectDatasets>;

export const Default: Story = {
  render: () => {
    const { collections } = useDaphneStore();
    const [selectedDatasets, setSelectedDatasets] = useState<string[]>(
      collections.map((c) => c.pid)
    );
    return (
      <SelectDatasets
        selectedDatasets={selectedDatasets}
        setSelectedDatasets={setSelectedDatasets}
      />
    );
  },
};
