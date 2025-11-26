"use client";
import ActionMenuSection from "@/components/ActionMenuSection";
import HostGuidance from "@/content/guidance/host.mdx";
import { baseComponents } from "@/modules/Guidance/Guidance";

export interface CollectionHostGuidanceProps {
  creating: boolean;
}

const CollectionHostGuidance = ({ creating }: CollectionHostGuidanceProps) => {
  return (
    <ActionMenuSection title="Host Guidance" fixedExpanded scrollable>
      <HostGuidance creating={creating} components={baseComponents} />
    </ActionMenuSection>
  );
};

export default CollectionHostGuidance;
