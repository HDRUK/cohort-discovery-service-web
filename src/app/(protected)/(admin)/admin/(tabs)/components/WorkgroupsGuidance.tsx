"use client";
import ActionMenuSection from "@/components/ActionMenuSection";
import WorkgroupGuidanceMdx from "@/content/guidance/custodianAdmin/workgroup.mdx";
import { baseComponents } from "@/modules/Guidance/Guidance";

export interface WorkgroupGuidanceProps {
  creating?: boolean;
}

const WorkgroupGuidance = ({}: WorkgroupGuidanceProps) => {
  return (
    <ActionMenuSection title="Workgroup Guidance" fixedExpanded scrollable>
      <WorkgroupGuidanceMdx components={baseComponents} />
    </ActionMenuSection>
  );
};

export default WorkgroupGuidance;
