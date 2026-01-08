"use client";
import useQueryBuilder from "@/store/useQueryBuilder";

import { useState, useCallback, useRef, useEffect } from "react";
import ActionMenu from "../ActionMenu";
import RuleMenu from "../RuleMenu";

import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  closestCorners,
  Active,
  MeasuringStrategy,
} from "@dnd-kit/core";

import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";

import RuleBoard from "@/modules/RuleBoard";
import DragOverlay from "@/components/DragOverlay";

import { RuleNodeType } from "@/types/rules";
import { findById, moveItemIntoGroup } from "@/utils/rules";
import MarqueeSelection from "@/components/MarqueeSelection";
import { Query } from "@/types/api";
import ThreePaneSwimLaneLayout from "../ThreePaneSwimLaneLayout";
import RightClickMenu from "@/components/RightClickMenu/RightClickMenu";
import useRightClickMenu from "@/hooks/useRightClickMenu";

const QueryBuilder = ({ query }: { query?: Query }) => {
  const {
    queryBuilderJson,
    resetQueryBuilderJson,
    setQueryBuilderJson,
    boardIndex,
    select,
    deselect,
    createNewGroup,
    createNewRule,
    createNewAgeFilter,
  } = useQueryBuilder((qb) => ({
    resetQueryBuilderJson: qb.resetQueryBuilderJson,
    queryBuilderJson: qb.queryBuilderJson,
    setQueryBuilderJson: qb.setQueryBuilderJson,
    boardIndex: qb.boardIndex,
    select: qb.select,
    deselect: qb.deselect,
    createNewGroup: qb.createNewGroup,
    createNewRule: qb.createNewRule,
    createNewAgeFilter: qb.createNewAgeFilter,
  }));

  useEffect(() => {
    resetQueryBuilderJson();
  }, [resetQueryBuilderJson]);

  useEffect(() => {
    if (query?.definition) {
      setQueryBuilderJson(query.definition);
    }
  }, [query, setQueryBuilderJson]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor)
  );

  const [active, setActive] = useState<Active | null>(null);
  const [activeNode, setActiveNode] = useState<RuleNodeType | null>(null);

  const onDragStart = (e: DragStartEvent) => {
    setActive(e.active);

    const node = findById(queryBuilderJson, e.active.id as string);
    if (node) {
      setActiveNode(node);
    }
  };

  const onDragOver = useCallback(
    (e: DragOverEvent) => {
      const { over } = e;

      if (!over) {
        return;
      }

      if (!active) return;

      const activeData = active.data.current;
      const overData = over.data.current;

      const activeGroupId = activeData?.groupId;
      const overGroupId = overData?.groupId;

      if (!overGroupId || !activeGroupId) return;

      if (activeData.id === overData.id) return;
      const groupItems = boardIndex?.itemsByGroup?.[overGroupId] ?? [];
      let targetIndex = groupItems?.indexOf(overData.id);

      targetIndex = targetIndex < 0 ? 0 : targetIndex;

      if (overData.type === "Spacer") {
        if (overData.position === "top") {
          targetIndex = 0;
        } else if (overData.position === "bottom") {
          targetIndex = groupItems.length;
        } else {
          targetIndex = overData.position;
        }
      }

      setQueryBuilderJson(
        moveItemIntoGroup(
          queryBuilderJson,
          activeData?.id as string,
          overGroupId,
          targetIndex
        )
      );
    },
    [active, queryBuilderJson, boardIndex, setQueryBuilderJson]
  );

  const onDragEnd = useCallback(
    (e: DragEndEvent) => {
      const { over } = e;

      if (!over || !active) {
        setActiveNode(null);
        setActive(null);
        return;
      }

      const activeData = active.data.current;
      const overData = over.data.current;

      const activeGroupId = activeData?.groupId;
      const overGroupId = overData?.groupId;

      if (!overGroupId || !activeGroupId) return;

      const groupItems = boardIndex.itemsByGroup[overGroupId] ?? [];
      let targetIndex = groupItems?.indexOf(overData.id);

      targetIndex = targetIndex < 0 ? 0 : targetIndex;

      if (overData.type === "Spacer") {
        if (overData.position === "top") {
          targetIndex = 0;
        } else {
          targetIndex = groupItems.length;
        }
      }

      setQueryBuilderJson(
        moveItemIntoGroup(
          queryBuilderJson,
          activeData.id,
          overGroupId,
          targetIndex
        )
      );

      setActiveNode(null);
      setActive(null);
    },
    [active, queryBuilderJson, boardIndex, setQueryBuilderJson]
  );

  const onChangeSelection = useCallback(
    (ids: string[], deselectedIds: string[]) => {
      select(ids);
      deselect(deselectedIds);
    },
    [deselect, select]
  );

  const boardRef = useRef<HTMLDivElement>(null);
  const { handleContextMenu, ...rightClickMenuMethods } = useRightClickMenu();

  const actions = [
    { action: createNewAgeFilter, label: "Add Age Filter" },
    { action: createNewRule, label: "Add Rule" },
    { action: createNewGroup, label: "Add Group" },
  ];

  return (
    <>
      <ThreePaneSwimLaneLayout
        left={<ActionMenu />}
        middle={
          <>
            <DndContext
              sensors={sensors}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDragEnd={onDragEnd}
              modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
              collisionDetection={closestCorners}
              measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
            >
              <RuleBoard
                ruleGroup={queryBuilderJson}
                onContextMenu={handleContextMenu}
              >
                <RightClickMenu {...rightClickMenuMethods} actions={actions} />
              </RuleBoard>

              <DragOverlay node={activeNode} />
            </DndContext>
          </>
        }
        middleProps={{ ref: boardRef }}
        right={<RuleMenu />}
        rightProps={{ scrollable: false }}
      />
      <MarqueeSelection
        containerRef={boardRef}
        selectable='[data-selectable="true"]'
        idAttr="data-id"
        ignoreWhenInside='[data-draggable="true"]'
        requireModifierKey="Shift"
        onChange={onChangeSelection}
      />
    </>
  );
};

export default QueryBuilder;
