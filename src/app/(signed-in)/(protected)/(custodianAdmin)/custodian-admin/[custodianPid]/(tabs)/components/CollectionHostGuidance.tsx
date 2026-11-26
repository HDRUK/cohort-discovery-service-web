"use client";
import ActionMenuSection from "@/components/ActionMenuSection";
import HostGuidance from "@/content/guidance/custodianAdmin/host.mdx";
import CreateHostGuidance from "@/content/guidance/custodianAdmin/createHost.mdx";
import { baseComponents } from "@/modules/Guidance/Guidance";

export interface CollectionHostGuidanceProps {
  creating: boolean;
}

const CollectionHostGuidance = ({ creating }: CollectionHostGuidanceProps) => {
  return (
    <ActionMenuSection title="Host Guidance" fixedExpanded scrollable>
      {creating ? (
        <CreateHostGuidance components={baseComponents} />
      ) : (
        <HostGuidance components={baseComponents} />
      )}
    </ActionMenuSection>
  );
};

export default CollectionHostGuidance;
