"use client";

import ToolGuidance from "@/content/guidance/queryBuilder/tool.mdx";
import RuleGuidance from "@/content/guidance/queryBuilder/rule.mdx";
import OperatorGuidance from "@/content/guidance/queryBuilder/operator.mdx";
import GroupGuidance from "@/content/guidance/queryBuilder/group.mdx";
import AgeFilterGuidance from "@/content/guidance/queryBuilder/ageFilter.mdx";
import EmptyRuleGuidance from "@/content/guidance/queryBuilder/emptyRule.mdx";
import MultipleItemGuidance from "@/content/guidance/queryBuilder/multipleItem.mdx";
import { Box, BoxProps, Link, LinkProps, TypographyProps } from "@mui/material";
import { useCallback, useMemo } from "react";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import ActionMenuSection from "@/components/ActionMenuSection";
import {
  createAgeFilter,
  createOperator,
  createRule,
  findById,
  isAgeFilter,
  isEmptyRule,
  isInGroup,
  isOperator,
  isRuleGroup,
  isRuleLeaf,
  removeById,
  updateById,
} from "@/utils/rules";
import { trueKeys } from "@/utils/numbers";
import {
  AgeFilterType,
  OperatorType,
  RuleGroupType,
  RuleLeafType,
  RuleNodeType,
} from "@/types/rules";
import ToggleExclusion from "@/content/guidance/components/ToggleExclusion";
import ShowDescendants from "@/content/guidance/components/ShowDescendants";
import ToggleOperator from "@/content/guidance/components/ToggleOperator";
import AddButton from "@/components/AddButton";
import { AddButtonProps } from "@/components/AddButton/AddButton";
import { AddChipProps } from "@/components/AddChip/AddChip";
import AddTimeFrameButton from "@/components/AddTimeFrameButton";
import RuleTimeframeSelector from "@/components/RuleTimeframeSelector";
import { CustomH1, CustomH2 } from "@/components/GuidanceHeaders";
import { getDomain, getDomainPastPhrase, getDomainPhrase } from "@/utils/omop";
import DeleteTimeFrameButton from "@/components/DeleteTimeFrameButton";
import DeleteMenuItem, {
  DeleteMenuItemProps,
} from "@/components/DeleteMenuItem/DeleteMenuItem";
import ConvertToGroupMenuItem, {
  ConvertToGroupMenuItemProps,
} from "@/components/ConvertToGroupMenuItem/ConvertToGroupMenuItem";
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
  Box: (props: BoxProps) => <Box {...props}></Box>,
};

const Guidance = () => {
  const { boardIndex, queryBuilderJson, setQueryBuilderJson, selected } =
    useQueryBuilder((qb) => ({
      boardIndex: qb.boardIndex,
      selected: qb.selected,
      queryBuilderJson: qb.queryBuilderJson,
      setQueryBuilderJson: qb.setQueryBuilderJson,
    }));

  const selectedIds = useMemo(() => trueKeys(selected), [selected]);
  const selectedNode = useMemo(() => {
    if (selectedIds.length === 0) return;
    const node = findById(queryBuilderJson, String(selectedIds[0]));
    return node;
  }, [queryBuilderJson, selectedIds]);

  const handleCreateNewAgeFilterInGroup = useCallback(
    (id: RuleGroupType["id"], rules: RuleGroupType["rules"]) => {
      const newRules = [createAgeFilter(), createOperator(), ...rules];

      setQueryBuilderJson(
        updateById(queryBuilderJson, id, (node) => ({
          ...node,
          rules: newRules,
        })),
      );
    },
    [queryBuilderJson, setQueryBuilderJson],
  );

  const handleCreateNewOperatorInGroup = useCallback(
    (id: RuleGroupType["id"], rules: RuleGroupType["rules"]) => {
      const newRules = [createOperator(), ...rules];

      setQueryBuilderJson(
        updateById(queryBuilderJson, id, (node) => ({
          ...node,
          rules: newRules,
        })),
      );
    },
    [queryBuilderJson, setQueryBuilderJson],
  );

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

  const handleDelete = useCallback(() => {
    const newQuery = selectedIds.reduce(
      (acc, id) => removeById(acc, String(id)),
      queryBuilderJson,
    );
    setQueryBuilderJson(newQuery);
  }, [selectedIds, queryBuilderJson, setQueryBuilderJson]);

  interface GuidanceProps extends TypographyProps {
    target: string;
    keyPrefix: string;
    title: string;
  }
  const makeRuleComponents = (node: RuleLeafType) => ({
    ...baseComponents,
    CollapsibleGuidance: (props: GuidanceProps) => (
      <CollapsibleGuidance {...props}></CollapsibleGuidance>
    ),
    ToggleExclusion: () => (
      <ToggleExclusion key="ToggleExclusion" node={node} />
    ),
    ShowDescendants: () => <ShowDescendants node={node} />,
    AddTimeFrameButton: (props: AddChipProps) => {
      return (
        !node.timeConstraint && (
          <AddTimeFrameButton
            key="RuleTimeframeSelector"
            rule={node}
            hoverKey={`rule-timeframe-${node.id}`}
            disabled={!!node.ageConstraint}
            {...props}
          />
        )
      );
    },
    AddAgeButton: (props: AddChipProps) => {
      return (
        !node.ageConstraint && (
          <AddAgeButton
            rule={node}
            hoverKey={`rule-age-${node.id}`}
            disabled={!!node.timeConstraint}
            {...props}
          />
        )
      );
    },
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
    CollapsibleGuidance: (props: GuidanceProps) => (
      <CollapsibleGuidance {...props}></CollapsibleGuidance>
    ),
  });

  const makeGroupComponents = (group: RuleGroupType) => {
    const { id, rules } = group;
    return {
      ...baseComponents,
      AddNewAgeFilterButton: (props: AddButtonProps) => (
        <AddButton
          {...props}
          onClick={() => handleCreateNewAgeFilterInGroup(id, rules)}
        />
      ),
      AddNewOperatorButton: (props: AddButtonProps) => (
        <AddButton
          {...props}
          onClick={() => handleCreateNewOperatorInGroup(id, rules)}
        />
      ),
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
  });

  const makeMultipleItemComponents = () => ({
    ...baseComponents,
    CollapsibleGuidance: (props: GuidanceProps) => (
      <CollapsibleGuidance {...props}></CollapsibleGuidance>
    ),
    DeleteMenuItem: (props: DeleteMenuItemProps) => (
      <DeleteMenuItem {...props} action={handleDelete}></DeleteMenuItem>
    ),
    ConvertToGroupMenuItem: (props: ConvertToGroupMenuItemProps) => (
      <ConvertToGroupMenuItem {...props} selectedNode={selectedNode} />
    ),
  });

  if (selectedIds.length > 1) {
    return (
      <ActionMenuSection title={"Bulk Select Actions"} fixedExpanded>
        <MultipleItemGuidance
          components={makeMultipleItemComponents()}
          containsGroup={
            selectedIds.some((id) =>
              isRuleGroup(
                findById(queryBuilderJson, String(id)) ?? ({} as RuleNodeType),
              ),
            ) || selectedIds.some((id) => isInGroup(String(id), boardIndex))
          }
        />
      </ActionMenuSection>
    );
  }
  if (!selectedNode) {
    return (
      <Box textAlign="center">
        <ToolGuidance components={baseComponents} />
      </Box>
    );
  } else {
    if (isRuleLeaf(selectedNode)) {
      const concept = selectedNode?.rule?.concept;
      const category = concept?.category || "";
      const { verb } = getDomainPhrase(category);
      const past = getDomainPastPhrase(category);
      const domain = getDomain(concept);

      return (
        <ActionMenuSection title={`${domain} Rule`} fixedExpanded>
          <RuleGuidance
            category={domain ?? ""}
            verb={verb}
            verbPastTense={past}
            timeConstraint={selectedNode?.timeConstraint}
            ageConstraint={selectedNode?.ageConstraint}
            components={makeRuleComponents(selectedNode)}
            showSelectors={
              !["Gender", "Race"].includes(
                selectedNode.rule.concept?.category || "",
              )
            }
          />
          {isEmptyRule(selectedNode) && (
            <EmptyRuleGuidance components={baseComponents} />
          )}
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
