"use client";

import ToolGuidance from "@/content/guidance/queryBuilder/tool.mdx";
import RuleGuidance from "@/content/guidance/queryBuilder/rule.mdx";
import OperatorGuidance from "@/content/guidance/queryBuilder/operator.mdx";
import GroupGuidance from "@/content/guidance/queryBuilder/group.mdx";
import AgeFilterGuidance from "@/content/guidance/queryBuilder/ageFilter.mdx";
import EmptyRuleGuidance from "@/content/guidance/queryBuilder/emptyRule.mdx";
import { Box, BoxProps, Link, LinkProps } from "@mui/material";
import { useCallback, useMemo } from "react";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import ActionMenuSection from "@/components/ActionMenuSection";
import {
  createOperator,
  createRule,
  findById,
  isAgeFilter,
  isEmptyRule,
  isOperator,
  isRuleGroup,
  updateById,
} from "@/utils/rules";
import { isRuleLeaf } from "@/utils/rules";
import { trueKeys } from "@/utils/numbers";
import {
  AgeFilterType,
  OperatorType,
  RuleGroupType,
  RuleLeafType,
} from "@/types/rules";
import ToggleExclusion from "@/content/guidance/components/ToggleExclusion";
import ShowDescendants from "@/content/guidance/components/ShowDescendants";
import ToggleOperator from "@/content/guidance/components/ToggleOperator";
import AddButton from "@/components/AddButton";
import { AddButtonProps } from "@/components/AddButton/AddButton";
import AddTimeFrameButton from "@/components/AddTimeFrameButton";
import RuleTimeframeSelector from "@/components/RuleTimeframeSelector";
import { CustomH1, CustomH2 } from "@/components/GuidanceHeaders";
import { getDomainVerbs } from "@/utils/omop";
import DeleteTimeFrameButton from "@/components/DeleteTimeFrameButton";
import { DeleteMenuItemProps } from "@/components/DeleteMenuItem/DeleteMenuItem";
import AddAgeButton from "@/components/AddAgeButton";
import RuleAgeSelector from "@/components/RuleAgeSelector";
import DeleteAgeButton from "@/components/DeleteAgeButton";
import useFeatures from "@/hooks/useFeatures";

export const baseComponents = {
  a: ({ href, children }: LinkProps) => (
    <Link
      sx={{ color: "link.main" }}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </Link>
  ),
  h1: CustomH1,
  h2: CustomH2,
  ul: (props: BoxProps) => (
    <Box
      component="ul"
      sx={{
        pl: 2,
        my: 1,
        listStyleType: "disc",
        listStylePosition: "outside",
      }}
      {...props}
    />
  ),
  li: (props: BoxProps) => (
    <Box
      component="li"
      sx={{
        display: "list-item",
        my: 0.5,
      }}
      {...props}
    />
  ),
};

const Guidance = () => {
  const { queryBuilderJson, setQueryBuilderJson, selected } = useQueryBuilder(
    (qb) => ({
      selected: qb.selected,
      queryBuilderJson: qb.queryBuilderJson,
      setQueryBuilderJson: qb.setQueryBuilderJson,
    }),
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
        })),
      );
    },
    [queryBuilderJson, setQueryBuilderJson],
  );

  const { constrainForBunnyV1 } = useFeatures();

  const makeRuleComponents = (node: RuleLeafType) => ({
    ...baseComponents,
    ToggleExclusion: () => <ToggleExclusion node={node} />,
    ShowDescendants: () => <ShowDescendants node={node} />,
    AddTimeFrameButton: (props: AddButtonProps) => (
      <AddTimeFrameButton
        rule={node}
        disabled={!!node.timeConstraint}
        {...props}
      />
    ),
    AddAgeButton: (props: AddButtonProps) => (
      <AddAgeButton rule={node} disabled={!!node.ageConstraint} {...props} />
    ),
    RuleTimeframeSelector: (props: { title: string }) => (
      <RuleTimeframeSelector rule={node} {...props} />
    ),
    DeleteTimeFrameButton: (props: DeleteMenuItemProps) => (
      <DeleteTimeFrameButton rule={node} {...props} />
    ),
    RuleAgeSelector: (props: { title: string }) => (
      <RuleAgeSelector
        rule={node}
        {...props}
        uniDirectional={constrainForBunnyV1}
      />
    ),
    DeleteAgeButton: (props: DeleteMenuItemProps) => (
      <DeleteAgeButton rule={node} {...props} />
    ),
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
          onClick={() => handleCreateNewRuleInGroup(id, rules)}
        />
      ),
    };
  };

  const makeAgeFilterComponents = (node: AgeFilterType) => ({
    ...baseComponents,
    RuleAgeSelector: (props: { title: string }) => (
      <RuleAgeSelector
        rule={node}
        {...props}
        uniDirectional={false}
        overrideConstrainForBunny={true}
      />
    ),
  });

  if (!selectedNode) {
    return (
      <ActionMenuSection title={"Tool Guidance"} fixedExpanded scrollable>
        <ToolGuidance components={baseComponents} />
      </ActionMenuSection>
    );
  } else {
    if (isRuleLeaf(selectedNode)) {
      if (isEmptyRule(selectedNode)) {
        return (
          <ActionMenuSection title={"Build Guidance"} fixedExpanded scrollable>
            <EmptyRuleGuidance components={baseComponents} />
          </ActionMenuSection>
        );
      }

      const category = selectedNode?.rule?.concept?.category || "";
      const { verb, verbPastTense } = getDomainVerbs(category);

      return (
        <ActionMenuSection title={"Rule"} fixedExpanded scrollable>
          <RuleGuidance
            category={selectedNode.rule.concept?.category || ""}
            verb={verb}
            verbPastTense={verbPastTense}
            components={makeRuleComponents(selectedNode)}
          />
        </ActionMenuSection>
      );
    } else if (isOperator(selectedNode)) {
      return (
        <ActionMenuSection title={"Operator"} fixedExpanded scrollable>
          <OperatorGuidance components={makeOperatorComponents(selectedNode)} />
        </ActionMenuSection>
      );
    } else if (isRuleGroup(selectedNode)) {
      return (
        <ActionMenuSection title={"Group"} fixedExpanded scrollable>
          <GroupGuidance components={makeGroupComponents(selectedNode)} />
        </ActionMenuSection>
      );
    } else if (isAgeFilter(selectedNode)) {
      return (
        <ActionMenuSection title={"Age"} fixedExpanded scrollable>
          <AgeFilterGuidance
            components={makeAgeFilterComponents(selectedNode)}
          />
        </ActionMenuSection>
      );
    }
  }
};

export default Guidance;
