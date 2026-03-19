"use client";

import { RuleNodeType } from "@/types/rules";
import { findById, isRuleGroup, moveItemIntoGroup } from "@/utils/rules";
import {
  Active,
  DndContext,
  DragEndEvent,
  DragStartEvent,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import { SortableContext } from "@dnd-kit/sortable";
import { List } from "@mui/material";
import { useCallback, useState } from "react";
import HierarchyItem from "@/components/HierarchyItem";
import { DEFAULT_ID_REF_SUFFIX } from "@/config/defaults";
import useHasMounted from "@/hooks/useHasMounted";
import SkeletonFull from "@/components/SkeletonFull";
import useQueryBuilder from "@/hooks/useQueryBuilder";

export const Hierarchy = () => {
  const { queryBuilderJson, setQueryBuilderJson, boardIndex } = useQueryBuilder(
    (qb) => ({
      queryBuilderJson: qb.queryBuilderJson,
      setQueryBuilderJson: qb.setQueryBuilderJson,
      boardIndex: qb.boardIndex,
    }),
  );

  const { rules } = queryBuilderJson;

  const [active, setActive] = useState<Active | null>(null);
  const [activeNode, setActiveNode] = useState<RuleNodeType | null>(null);
  const hasMounted = useHasMounted();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const onDragStart = useCallback(
    (e: DragStartEvent) => {
      setActive(e.active);

      const node = findById(
        queryBuilderJson,
        e.active.data.current?.id as string,
      );

      if (node) {
        setActiveNode(node);
      }
    },
    [queryBuilderJson],
  );

  const onDragEnd = useCallback(
    ({ over }: DragEndEvent) => {
      if (!active) return;
      if (!activeNode) return;
      if (!over) return;

      const overGroupId = over?.data?.current?.groupId as string;
      const activeGroupId = active?.data?.current?.groupId as string;

      if (isRuleGroup(activeNode) && overGroupId !== activeGroupId) return;

      const activeId = active?.data?.current?.id;
      const overId = over?.data?.current?.id;
      const board = boardIndex.itemsByGroup[overGroupId];

      const currentIndex = board.indexOf(activeId as string);

      const targetIndex =
        board.indexOf(overId as string) + (currentIndex < 0 ? 1 : 0);

      setQueryBuilderJson(
        moveItemIntoGroup(queryBuilderJson, activeId, overGroupId, targetIndex),
      );

      setActive(null);
      setActiveNode(null);
    },
    [active, activeNode, boardIndex, queryBuilderJson, setQueryBuilderJson],
  );

  if (!hasMounted) return <SkeletonFull sx={{ minHeight: 1000, mt: 1 }} />;

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={() => {
        setActive(null);
        setActiveNode(null);
      }}
    >
      <List disablePadding>
        <SortableContext
          items={queryBuilderJson.rules.map(
            (r) => `${DEFAULT_ID_REF_SUFFIX}-${r.id}`,
          )}
        >
          {rules.map((node: RuleNodeType) => (
            <HierarchyItem
              key={node.id}
              node={node}
              groupId={queryBuilderJson.id}
              selectedIsGroup={(activeNode && isRuleGroup(activeNode)) ?? false}
            />
          ))}
        </SortableContext>
      </List>
    </DndContext>
  );
};
