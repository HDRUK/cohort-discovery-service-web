"use client";

import { RuleNodeType } from "@/types/rules";
import { moveItemIntoGroup } from "@/utils/rules";
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
import { ID_REF_SUFFIX } from "@/config/defaults";
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
  const hasMounted = useHasMounted();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const onDragStart = ({ active }: DragStartEvent) => setActive(active);

  const onDragEnd = useCallback(
    ({ over }: DragEndEvent) => {
      if (!active) return;
      if (!over) return;

      const overGroupId = over?.data?.current?.groupId as string;

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
    },
    [active, boardIndex, queryBuilderJson, setQueryBuilderJson],
  );

  if (!hasMounted) return <SkeletonFull sx={{ minHeight: 1000, mt: 1 }} />;

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={() => setActive(null)}
    >
      <List disablePadding>
        <SortableContext
          items={queryBuilderJson.rules.map((r) => `${ID_REF_SUFFIX}-${r.id}`)}
        >
          {rules.map((node: RuleNodeType) => (
            <HierarchyItem
              key={node.id}
              node={node}
              groupId={queryBuilderJson.id}
            />
          ))}
        </SortableContext>
      </List>
    </DndContext>
  );
};
