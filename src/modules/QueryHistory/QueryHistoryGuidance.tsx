"use client";

import QueryHistoryMdx from "@/content/guidance/queryHistory.mdx";
import HistoryActions from "@/content/guidance/components/HistoryActions";
import { baseComponents } from "@/modules/Guidance/Guidance";
import ActionMenuSection from "@/components/ActionMenuSection";

const QueryHistoryGuidance = ({ selectedIds }: { selectedIds: string[] }) => {
  const empty = !selectedIds.length;

  const multiple = !empty && selectedIds.length > 1;

  const components = {
    ...baseComponents,
    empty: () => empty,
    HistoryActions: () => (
      <HistoryActions multiple={multiple} selectedIds={selectedIds} />
    ),
  };
  return (
    <ActionMenuSection
      title={`Result History${multiple ? " Bulk Actions" : ""}`}
      fixedExpanded
      scrollable
    >
      <QueryHistoryMdx
        components={components}
        empty={empty}
        multiple={multiple}
        selectedIds={selectedIds}
      />
    </ActionMenuSection>
  );
};

export default QueryHistoryGuidance;
