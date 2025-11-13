"use client";

import ToolGuidance from "@/content/guidance/tool.mdx";
import RuleGuidance from "@/content/guidance/rule.mdx";
import { Box, Typography } from "@mui/material";
import { ReactNode, useMemo } from "react";
import useQueryBuilder from "@/store/useQueryBuilder";
import ActionMenuSection from "@/components/ActionMenuSection";
import { findById } from "@/utils/rules";
import { isRuleLeaf } from "@/utils/rules";
import { trueKeys } from "@/utils/numbers";
import { RuleLeafType } from "@/types/rules";
import ToggleExclusion from "@/content/guidance/components/ToggleExclusion";
import ShowDescendants from "@/content/guidance/components/ShowDescendants";

function CustomH1({ children }: { children: ReactNode }) {
  return (
    <Typography variant="guidance1" sx={{ borderBottom: 2, my: 1 }}>
      {children}
    </Typography>
  );
}

function CustomH2({ children }: { children: ReactNode }) {
  return <Typography variant="guidance2">{children}</Typography>;
}

const baseComponents = {
  h1: CustomH1,
  h2: CustomH2,
};

const makeRuleComponents = (node: RuleLeafType) => ({
  ...baseComponents,
  ToggleExclusion: () => <ToggleExclusion node={node} />,
  ShowDescendants: () => <ShowDescendants node={node} />,
});

const Guidance = () => {
  const { queryBuilderJson, selected } = useQueryBuilder((qb) => ({
    selected: qb.selected,
    queryBuilderJson: qb.queryBuilderJson,
  }));

  const selectedIds = useMemo(() => trueKeys(selected), [selected]);
  const selectedNode = useMemo(() => {
    if (selectedIds.length !== 1) return;
    const node = findById(queryBuilderJson, String(selectedIds[0]));
    return node;
  }, [queryBuilderJson, selectedIds]);

  return (
    <Box sx={{ px: 1 }}>
      {queryBuilderJson.rules.length === 0 && (
        <ActionMenuSection title={"Tool Guidance"} defaultExpanded>
          <ToolGuidance components={baseComponents} />
        </ActionMenuSection>
      )}
      {selectedNode
        ? isRuleLeaf(selectedNode) && (
            <ActionMenuSection title={"Rule"} defaultExpanded>
              <RuleGuidance components={makeRuleComponents(selectedNode)} />
            </ActionMenuSection>
          )
        : null}
    </Box>
  );
};

export default Guidance;
