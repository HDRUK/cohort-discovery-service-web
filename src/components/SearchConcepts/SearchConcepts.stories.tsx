import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import SearchConcepts from "./SearchConcepts";
import type { Concept } from "@/types/api";
import MockDaphneStore from "@/store/MockDaphneStore";

const meta: Meta<typeof SearchConcepts> = {
  title: "Components/SearchConcepts",
  component: SearchConcepts,
};
export default meta;

type Story = StoryObj<typeof SearchConcepts>;

const Component = (props: React.ComponentProps<typeof SearchConcepts>) => {
  const [selected, setSelected] = useState<Record<number, boolean>>({});
  return (
    <SearchConcepts {...props} selected={selected} setSelected={setSelected} />
  );
};

export const NoDomainMultipleSelect: Story = {
  render: () => (
    <MockDaphneStore>
      <Component multiple={true} />
    </MockDaphneStore>
  ),
};

export const ConditionMultipleSelect: Story = {
  render: () => (
    <MockDaphneStore>
      <Component multiple={true} domain="Condition" />
    </MockDaphneStore>
  ),
};

export const NoDomainSingleSelect: Story = {
  render: () => (
    <MockDaphneStore>
      <Component
        multiple={false}
        onClick={(c: Concept) => alert(`${c.name} clicked`)}
      />
    </MockDaphneStore>
  ),
};
