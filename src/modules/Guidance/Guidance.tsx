"use client";

import ToolGuidance from "@/content/guidance/tool.mdx";
import RuleGuidance from "@/content/guidance/rule.mdx";
import OperatorGuidance from "@/content/guidance/operator.mdx";
import GroupGuidance from "@/content/guidance/group.mdx";
import { Box, Typography } from "@mui/material";
import { ReactNode, useCallback, useMemo } from "react";
import useQueryBuilder from "@/store/useQueryBuilder";
import ActionMenuSection from "@/components/ActionMenuSection";
import {
  createOperator,
  createRule,
  findById,
  isOperator,
  isRuleGroup,
  updateById,
} from "@/utils/rules";
import { isRuleLeaf } from "@/utils/rules";
import { trueKeys } from "@/utils/numbers";
import { OperatorType, RuleGroupType, RuleLeafType } from "@/types/rules";
import ToggleExclusion from "@/content/guidance/components/ToggleExclusion";
import ShowDescendants from "@/content/guidance/components/ShowDescendants";
import ToggleOperator from "@/content/guidance/components/ToggleOperator";
import AddButton from "@/components/AddButton";
import { AddButtonProps } from "@/components/AddButton/AddButton";

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

const Guidance = () => {
  const { queryBuilderJson, setQueryBuilderJson, selected } = useQueryBuilder(
    (qb) => ({
      selected: qb.selected,
      queryBuilderJson: qb.queryBuilderJson,
      setQueryBuilderJson: qb.setQueryBuilderJson,
    })
  );

  const selectedIds = useMemo(() => trueKeys(selected), [selected]);
  const selectedNode = useMemo(() => {
    if (selectedIds.length !== 1) return;
    const node = findById(queryBuilderJson, String(selectedIds[0]));
    return node;
  }, [queryBuilderJson, selectedIds]);

  const handleCreateNewRuleInGroup = useCallback(
    (id: RuleGroupType["id"], rules: RuleGroupType["rules"]) => {
      const newRules = [createRule(), createOperator(), ...rules];

      setQueryBuilderJson(
        updateById(queryBuilderJson, id, (node) => ({
          ...node,
          rules: newRules,
        }))
      );
    },
    [queryBuilderJson, setQueryBuilderJson]
  );

  const makeRuleComponents = (node: RuleLeafType) => ({
    ...baseComponents,
    ToggleExclusion: () => <ToggleExclusion node={node} />,
    ShowDescendants: () => <ShowDescendants node={node} />,
  });

  const makeOperatorComponents = (node: OperatorType) => ({
    ...baseComponents,
    ToggleOperator: () => <ToggleOperator operator={node} />,
  });

  const makeGroupComponents = (group: RuleGroupType) => {
    const { id, rules } = group;
    return {
      ...baseComponents,
      AddNewRuleButton: (props: AddButtonProps) => (
        <AddButton
          {...props}
          action={() => handleCreateNewRuleInGroup(id, rules)}
        />
      ),
    };
  };

  return (
    <Box sx={{ px: 1 }}>
      {!selectedNode && (
        <ActionMenuSection title={"Tool Guidance"} fixedExpanded>
          <ToolGuidance components={baseComponents} />
        </ActionMenuSection>
      )}
      {selectedNode && (
        <>
          {isRuleLeaf(selectedNode) && (
            <ActionMenuSection title={"Rule"} fixedExpanded>
              <RuleGuidance components={makeRuleComponents(selectedNode)} />
            </ActionMenuSection>
          )}
          {isOperator(selectedNode) && (
            <ActionMenuSection title={"Operator"} fixedExpanded>
              <OperatorGuidance
                components={makeOperatorComponents(selectedNode)}
              />
            </ActionMenuSection>
          )}
          {isRuleGroup(selectedNode) && (
            <ActionMenuSection title={"Group"} fixedExpanded>
              <GroupGuidance components={makeGroupComponents(selectedNode)} />
            </ActionMenuSection>
          )}
        </>
      )}
    </Box>
  );
};

export default Guidance;
