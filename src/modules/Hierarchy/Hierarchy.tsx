"use client";
import ActionMenuSection from "@/components/ActionMenuSection";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import useSortable from "@/hooks/useSortable";
import { useDaphneStore } from "@/store/useDaphneStore";
import { RuleNodeType } from "@/types/rules";
import { isRuleGroup, moveItemIntoGroup } from "@/utils/rules";
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
import {
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Skeleton,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

import { listItemButtonSx } from "./Hierarchy.style";
import EditableText from "@/components/EditableText";

const INDENT_STEP = 2;
const ID_REF_SUFFIX = "hierarchyMenuItem";

type RuleNodeProps = {
  node: RuleNodeType;
  groupId: string;
  depth?: number;
};

const RuleNode = ({ node, groupId, depth = 0 }: RuleNodeProps) => {
  const {
    queryBuilder: { toggleSelected, selected, getNodeName, setNodeName },
  } = useDaphneStore();

  const id = `${ID_REF_SUFFIX}-${node.id}`;

  const {
    setNodeRef,
    isDragging,
    attributes,
    listeners,
    transition,
    isOver,
    isAbove,
  } = useSortable({
    id,
    data: {
      id: node.id,
      groupId,
    },
  });

  const style = {
    transition,
  };

  const isGroup = isRuleGroup(node) && node.rules.length > 0;

  const toggleCheckbox = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const nextParent = !selected[node.id];
    toggleSelected(node.id);
    if (!isRuleGroup(node)) return;

    node.rules.forEach((r) => {
      const childVal = !!selected[r.id];
      if (childVal !== nextParent) {
        toggleSelected(r.id);
      }
    });
  };

  const nodeName = getNodeName(node);

  const content = (
    <ListItemButton
      component="div"
      sx={listItemButtonSx(isDragging, isOver, isAbove)}
    >
      <Checkbox
        size="medium"
        checked={selected[node.id] || false}
        onClick={toggleCheckbox}
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      />
      <ListItemText
        primary={
          <EditableText
            value={nodeName}
            onCommit={(name) => setNodeName(node, name)}
            typographyProps={{
              component: "span",
            }}
            textFieldProps={{
              variant: "standard",
              size: "small",
            }}
          />
        }
      />
      {!node.valid ? (
        <WarningAmberIcon fontSize="small" color="warning" />
      ) : (
        <></>
      )}
    </ListItemButton>
  );

  if (!isGroup) {
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <ListItem disablePadding disableGutters sx={{ pl: depth }}>
          {content}
        </ListItem>
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ActionMenuSection id={`rule-${node.id}`} summary={content}>
        {({ expanded }) => (
          <List disablePadding>
            <SortableContext
              items={node.rules.map((r) => `${ID_REF_SUFFIX}-${r.id}`)}
              disabled={!expanded}
            >
              {!isDragging &&
                node.rules.map((child) => (
                  <RuleNode
                    key={child.id}
                    node={child}
                    groupId={node.id}
                    depth={depth + INDENT_STEP}
                  />
                ))}
            </SortableContext>
          </List>
        )}
      </ActionMenuSection>
    </div>
  );
};

export const Hierarchy = () => {
  const {
    queryBuilder: { queryBuilderJson, setQueryBuilderJson, boardIndex },
  } = useDaphneStore();

  const { rules } = queryBuilderJson;

  const [active, setActive] = useState<Active | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const onDragStart = ({ active }: DragStartEvent) => setActive(active);

  const onDragEnd = useCallback(
    ({ over }: DragEndEvent) => {
      if (!active) return;
      if (!over) return;

      const overGroupId = over?.data?.current?.groupId as string;

      const activeId = active?.data?.current?.id;
      const overId = over?.data?.current?.id;
      const targetIndex = boardIndex.itemsByGroup[overGroupId].indexOf(
        overId as string
      );

      setQueryBuilderJson(
        moveItemIntoGroup(queryBuilderJson, activeId, overGroupId, targetIndex)
      );

      setActive(null);
    },
    [active, boardIndex, queryBuilderJson, setQueryBuilderJson]
  );

  if (!hasMounted) return <Skeleton />;

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
            <RuleNode key={node.id} node={node} groupId={queryBuilderJson.id} />
          ))}
        </SortableContext>
      </List>
    </DndContext>
  );
};
