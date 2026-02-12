"use client";
import ActionMenuSection from "@/components/ActionMenuSection";
import CollectionGuidanceMdx from "@/content/guidance/custodianAdmin/collection.mdx";
import CreateCollectionGuidanceMdx from "@/content/guidance/custodianAdmin/createCollection.mdx";
import { baseComponents } from "@/modules/Guidance/Guidance";

const API_URL = process.env.NEXT_PUBLIC_TASK_URL ?? "localhost";

export interface CollectionGuidanceProps {
  creating?: boolean;
}

const CollectionGuidance = ({ creating }: CollectionGuidanceProps) => {
  return (
    <ActionMenuSection title="Collection Guidance" fixedExpanded scrollable>
      {creating ? (
        <CreateCollectionGuidanceMdx
          taskUrl={API_URL}
          components={baseComponents}
        />
      ) : (
        <CollectionGuidanceMdx components={baseComponents} />
      )}
    </ActionMenuSection>
  );
};

export default CollectionGuidance;
