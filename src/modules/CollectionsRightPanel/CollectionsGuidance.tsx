"use client";
import ActionMenuSection from "@/components/ActionMenuSection";
import CollectionGuidanceMdx from "@/content/guidance/collection.mdx";
import { baseComponents } from "@/modules/Guidance/Guidance";

export interface CollectionGuidanceProps {
  creating?: boolean;
}

const CollectionGuidance = ({}: CollectionGuidanceProps) => {
  return (
    <ActionMenuSection title="Collection Guidance" fixedExpanded scrollable>
      <CollectionGuidanceMdx components={baseComponents} />
    </ActionMenuSection>
  );
};

export default CollectionGuidance;
