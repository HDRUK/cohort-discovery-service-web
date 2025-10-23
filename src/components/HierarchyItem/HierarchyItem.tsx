"use client";
import ActionMenuSection from "@/components/ActionMenuSection";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import useSortable from "@/hooks/useSortable";
import { useDaphneStore } from "@/store/useDaphneStore";
import { RuleNodeType } from "@/types/rules";
import { isRuleGroup } from "@/utils/rules";

import { SortableContext } from "@dnd-kit/sortable";
import {
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import EditableText from "@/components/EditableText";
import { ID_REF_SUFFIX } from "@/config/defaults";
import { listItemButtonSx, INDENT_STEP } from "./HierarchyItem.style";

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
      <ActionMenuSection
        id={`rule-${node.id}`}
        summary={content}
        sx={{ pl: depth }}
      >
        {({ expanded }) => (
          <List disablePadding>
            <SortableContext
              items={node.rules.map((r) => `${ID_REF_SUFFIX}-${r.id}`)}
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
