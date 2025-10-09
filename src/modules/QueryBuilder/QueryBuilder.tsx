"use client";
import { useDaphneStore } from "@/store/useDaphneStore";

import { useState, useCallback, useRef } from "react";
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
} from "@dnd-kit/core";

import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";

import RuleBoard from "@/modules/RuleBoard";
import DragOverlay from "@/components/DragOverlay";

import { RuleNodeType } from "@/types/rules";
import { findById, moveItemInModel } from "@/utils/rules";

const TOP_SUFFIX = "::top" as const;
const BOTTOM_SUFFIX = "::bottom" as const;

type EdgeZone = "top" | "bottom" | null;

const parseOverId = (
  id: unknown
): { baseId: string | null; zone: EdgeZone } => {
  if (typeof id !== "string") return { baseId: null, zone: null };

  if (id.endsWith(TOP_SUFFIX)) {
    return { baseId: id.slice(0, -TOP_SUFFIX.length), zone: "top" };
  }
  if (id.endsWith(BOTTOM_SUFFIX)) {
    return { baseId: id.slice(0, -BOTTOM_SUFFIX.length), zone: "bottom" };
  }
  return { baseId: id, zone: null };
};

const QueryBuilder = () => {
  const {
    queryBuilder: { queryBuilderJson, setQueryBuilderJson, boardIndex },
  } = useDaphneStore();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
    useSensor(KeyboardSensor)
  );

  const findContainer = useCallback(
    (id: string | string | null): string | null => {
      if (!id) return null;
      if (boardIndex.containers.includes(id as string)) return id as string;
      return (
        (Object.keys(boardIndex.itemsByContainer) as string[]).find((c) =>
          boardIndex.itemsByContainer[c].includes(id as string)
        ) ?? null
      );
    },
    [boardIndex]
  );

  const hoverTimerRef = useRef<number | null>(null);
  const hoverTargetRef = useRef<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const [activeNode, setActiveNode] = useState<RuleNodeType | null>(null);

  const clearHoverTimer = () => {
    if (hoverTimerRef.current) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    hoverTargetRef.current = null;
  };

  const lastOverContainerRef = useRef<string | null>(null);

  const onDragStart = (e: DragStartEvent) => {
    setActiveId(e.active.id as string);
    const node = findById(queryBuilderJson, e.active.id as string);
    if (node) {
      setActiveNode(node);
    }
  };

  const onDragOver = useCallback(
    (e: DragOverEvent) => {
      const { over } = e;

      if (!over) {
        clearHoverTimer();
        return;
      }

      const { baseId: overId, zone } = parseOverId(over.id as string);
      const activeContainer = findContainer(activeId);
      const overContainer = findContainer(overId);

      if (!activeContainer || !overContainer) return;
      if (overContainer === activeContainer && !zone) return;

      if (lastOverContainerRef.current === overContainer) return;
      lastOverContainerRef.current = overContainer;

      const containerItems = boardIndex.itemsByContainer[overContainer] ?? [];
      let targetIndex = containerItems.length;

      if (zone) {
        targetIndex = zone === "top" ? 0 : containerItems.length;
      }

      setQueryBuilderJson(
        moveItemInModel(
          queryBuilderJson,
          activeId as string,
          overContainer,
          targetIndex
        )
      );
    },
    [activeId, queryBuilderJson, boardIndex, setQueryBuilderJson, findContainer]
  );

  const onDragEnd = useCallback(
    (e: DragEndEvent) => {
      setActiveNode(null);
      clearHoverTimer();
      const { over } = e;
      if (!over) {
        setActiveId(null);
        return;
      }

      const activeContainer = findContainer(activeId as string);
      const overContainer = findContainer(over.id as string);
      if (!activeContainer || !overContainer) {
        setActiveId(null);
        return;
      }

      const overItems = boardIndex.itemsByContainer[overContainer];
      const overIndex = overItems.indexOf(over.id as string);
      const targetIndex = overIndex >= 0 ? overIndex : "end";

      if (!activeContainer || !overContainer) {
        return;
      }

      setQueryBuilderJson(
        moveItemInModel(
          queryBuilderJson,
          activeId as string,
          overContainer,
          targetIndex
        )
      );

      setActiveId(null);
    },
    [activeId, queryBuilderJson, boardIndex, setQueryBuilderJson, findContainer]
  );

  return (
    <Grid
      container
      spacing={2}
      sx={{
        minHeight: "70vh",
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
