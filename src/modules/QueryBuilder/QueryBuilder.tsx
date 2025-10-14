"use client";
import { useDaphneStore } from "@/store/useDaphneStore";

import { useState, useCallback } from "react";
import { Grid } from "@mui/material";
import SwimLane from "@/components/SwimLane";
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

const QueryBuilder = () => {
  const {
    queryBuilder: { queryBuilderJson, setQueryBuilderJson, boardIndex },
  } = useDaphneStore();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 1 } }),
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
      return;
      if (!active) return;

      const activeData = active.data.current;
      const overData = over.data.current;

      const activeGroupId = activeData?.groupId;
      const overGroupId = overData?.groupId;

      if (!overGroupId || !activeGroupId) return;

      if (activeData.id === overData.id) return;

      const groupItems = boardIndex.itemsByGroup[overGroupId] ?? [];
      let targetIndex = groupItems.length;
      if (overData.type === "Spacer" && overData.position === "top") {
        targetIndex = 0;
      }

      setQueryBuilderJson(
        moveItemIntoGroup(
          queryBuilderJson,
          activeData.id,
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
      const overIndex = groupItems.indexOf(overData.id);
      const targetIndex = overIndex >= 0 ? overIndex : "end";

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

  return (
    <Grid
      container
      spacing={2}
      sx={{
        minHeight: "20vh",
        my: 2,
      }}
    >
      <Grid size={3}>
        <SwimLane
          sx={{
            position: "sticky",
            top: (theme) => theme.spacing(2),
          }}
        >
          <ActionMenu />
        </SwimLane>
      </Grid>

      <Grid size={6}>
        <SwimLane
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <DndContext
            sensors={sensors}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
            collisionDetection={closestCorners}
            measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
          >
            <RuleBoard ruleGroup={queryBuilderJson} />
            <DragOverlay node={activeNode} />
          </DndContext>
        </SwimLane>
      </Grid>

      <Grid size={3}>
        <SwimLane
          sx={{
            position: "sticky",
            top: (theme) => theme.spacing(2),
          }}
        >
          <RuleMenu />
        </SwimLane>
      </Grid>
    </Grid>
  );
};

export default QueryBuilder;
