"use client";

import ToolGuidance from "@/content/guidance/queryBuilder/tool.mdx";
import RuleGuidance from "@/content/guidance/queryBuilder/rule.mdx";
import OperatorGuidance from "@/content/guidance/queryBuilder/operator.mdx";
import GroupGuidance from "@/content/guidance/queryBuilder/group.mdx";
import AgeFilterGuidance from "@/content/guidance/queryBuilder/ageFilter.mdx";
import EmptyRuleGuidance from "@/content/guidance/queryBuilder/emptyRule.mdx";
import { Box, BoxProps, Link, LinkProps, TypographyProps } from "@mui/material";
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
  isRuleLeaf,
  updateById,
} from "@/utils/rules";
import { trueKeys } from "@/utils/numbers";
import { capitaliseFirstLetter } from "@/utils/string";
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
import CollapsibleGuidance from "@/components/CollapsibleGuidance";

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

  interface GuidanceProps extends TypographyProps {
    target: string;
    keyPrefix: string;
    title: string;
  }
  const makeRuleComponents = (node: RuleLeafType) => ({
    ...baseComponents,
    Box: (props: BoxProps) => <Box {...props}></Box>,
    CollapsibleGuidance: (props: GuidanceProps) => (
      <CollapsibleGuidance {...props}></CollapsibleGuidance>
    ),
    ToggleExclusion: () => (
      <ToggleExclusion key="ToggleExclusion" node={node} />
    ),
    ShowDescendants: () => <ShowDescendants node={node} />,
    AddTimeFrameButton: (props: AddButtonProps) =>
      !node.timeConstraint && (
        <AddTimeFrameButton
          key="RuleTimeframeSelector"
          rule={node}
          {...props}
        />
      ),
    AddAgeButton: (props: AddButtonProps) =>
      !node.ageConstraint && <AddAgeButton rule={node} {...props} />,
    RuleTimeframeSelector: (props: { title: string }) => (
      <RuleTimeframeSelector
        key="RuleTimeframeSelector"
        rule={node}
        {...props}
      />
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
    Box: (props: BoxProps) => <Box {...props}></Box>,
    CollapsibleGuidance: (props: GuidanceProps) => (
      <CollapsibleGuidance {...props}></CollapsibleGuidance>
    ),
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
    CollapsibleGuidance: (props: GuidanceProps) => (
      <CollapsibleGuidance {...props}></CollapsibleGuidance>
    ),
    RuleAgeSelector: (props: { title: string }) => (
      <RuleAgeSelector
        rule={node}
        {...props}
        uniDirectional={false}
        overrideConstrainForBunny={true}
      />
    ),
    Box: (props: BoxProps) => <Box {...props}></Box>,
  });

  if (!selectedNode) {
    return (
      <ActionMenuSection title={"Tool Guidance"} fixedExpanded>
        <ToolGuidance components={baseComponents} />
      </ActionMenuSection>
    );
  } else {
    if (isRuleLeaf(selectedNode)) {
      if (isEmptyRule(selectedNode)) {
        return (
          <ActionMenuSection title={"Search Categories"} fixedExpanded>
            <EmptyRuleGuidance components={baseComponents} />
          </ActionMenuSection>
        );
      }

      const category = selectedNode?.rule?.concept?.category || "";
      const { verb, verbPastTense, noun } = getDomainVerbs(
        category.toLowerCase(),
      );

      return (
        <ActionMenuSection title={"Rule"} fixedExpanded>
          <RuleGuidance
            category={capitaliseFirstLetter(
              selectedNode.rule.concept?.category || "",
            )}
            verb={verb}
            verbPastTense={verbPastTense}
            noun={capitaliseFirstLetter(noun)}
            timeConstraint={selectedNode?.timeConstraint}
            ageConstraint={selectedNode?.ageConstraint}
            components={makeRuleComponents(selectedNode)}
          />
        </ActionMenuSection>
      );
    } else if (isOperator(selectedNode)) {
      return (
        <ActionMenuSection title={"Operator"} fixedExpanded>
          <OperatorGuidance components={makeOperatorComponents(selectedNode)} />
        </ActionMenuSection>
      );
    } else if (isRuleGroup(selectedNode)) {
      return (
        <ActionMenuSection title={"Group"} fixedExpanded>
          <GroupGuidance components={makeGroupComponents(selectedNode)} />
        </ActionMenuSection>
      );
    } else if (isAgeFilter(selectedNode)) {
      return (
        <ActionMenuSection title={"Age Rule"} fixedExpanded>
          <AgeFilterGuidance
            components={makeAgeFilterComponents(selectedNode)}
          />
        </ActionMenuSection>
      );
    }
  }
};

export default Guidance;
