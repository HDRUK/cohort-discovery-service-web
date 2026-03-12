"use client";
import ActionMenuSection from "@/components/ActionMenuSection";
import useSortable from "@/hooks/useSortable";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import { RuleNodeType } from "@/types/rules";
import { isRuleGroup } from "@/utils/rules";

import { SortableContext } from "@dnd-kit/sortable";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import EditableText from "@/components/EditableText";
import { DEFAULT_ID_REF_SUFFIX } from "@/config/defaults";
import { listItemButtonSx, INDENT_STEP } from "./HierarchyItem.style";
import InvalidRule from "../InvalidRule";
import useRightClickMenu from "@/hooks/useRightClickMenu";
import RightClickMenu from "../RightClickMenu/RightClickMenu";
import useNodeActions from "@/hooks/useNodeActions";
import { trueKeys } from "@/utils/numbers";
import SquareRadio from "../SquareRadio";

type HierarchyItemProps = {
  node: RuleNodeType;
  groupId: string;
  depth?: number;
};

export const HierarchyItem = ({
  node,
  groupId,
  depth = 0,
}: HierarchyItemProps) => {
  const {
    select,
    deselect,
    toggleSelected,
    selected,
    getNodeName,
    setNodeName,
    hovered,
  } = useQueryBuilder((qb) => ({
    select: qb.select,
    deselect: qb.deselect,
    toggleSelected: qb.toggleSelected,
    selected: qb.selected,
    getNodeName: qb.getNodeName,
    setNodeName: qb.setNodeName,
    hovered: qb.hovered,
  }));
  const id = `${DEFAULT_ID_REF_SUFFIX}-${node.id}`;

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

    const isShift = e.shiftKey;
    const isMeta = e.metaKey;

    const nextParent = !selected[node.id];
    toggleSelected(node.id, !isShift);
    if (!isRuleGroup(node)) return;

    node.rules.forEach((r) => {
      if (isMeta) {
        if (nextParent) {
          select(r.id);
        } else {
          deselect(r.id);
        }
      }
    });
  };

  const nodeName = getNodeName(node);

  const { handleContextMenu, ...rightClickMenuMethods } = useRightClickMenu();
  const { actions } = useNodeActions(node);

  const content = (
    <ListItemButton
      onClick={toggleCheckbox}
      onContextMenu={handleContextMenu}
      component="div"
      sx={listItemButtonSx(
        isDragging,
        isOver,
        isAbove,
        depth,
        selected[node.id],
        !!hovered?.[node.id],
      )}
    >
      <SquareRadio
        size="medium"
        checked={selected[node.id] || false}
        onClick={toggleCheckbox}
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      />
      <ListItemText
        primary={
          <EditableText
            defaultValue={nodeName}
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
        <InvalidRule minimised reasons={node.invalidReason || []} />
      ) : null}
      <RightClickMenu {...rightClickMenuMethods} actions={actions} />
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

  const groupIds = node.rules.map((rule) => rule.id);
  const selectedIds = trueKeys(selected);
  const hasAnySelectedInGroup = selectedIds.some((id) =>
    groupIds.includes(id as string),
  );

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ActionMenuSection
        id={`rule-${node.id}`}
        summary={content}
        sx={{ pl: depth }}
        externalValue={hasAnySelectedInGroup ? true : undefined}
      >
        {({ expanded }) => (
          <List disablePadding>
            <SortableContext
              items={node.rules.map((r) => `${DEFAULT_ID_REF_SUFFIX}-${r.id}`)}
              disabled={!expanded}
            >
              {!isDragging &&
                node.rules.map((child) => (
                  <HierarchyItem
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
