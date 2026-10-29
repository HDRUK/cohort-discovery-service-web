import {
  Box,
  IconButton,
  Skeleton,
  Card,
  CardHeader,
  Chip,
  CardContent,
  Collapse,
  Fade,
  Divider,
} from "@mui/material";
import { ReactNode, useCallback, useMemo, useState } from "react";
import useSortable from "@/hooks/useSortable";
import { useCohortBuilderContext } from "@/providers/CohortBuilderProvider";
import useIsInDragOverlay from "@/hooks/useIsInDragOverlay";
import { DragType } from "@/types/dnd";
import { DragIndicator } from "@mui/icons-material";
import useQueryBuilder from "@/hooks/useQueryBuilder";

import {
  containerSx,
  deleteButtonSx,
  deleteIconSx,
  dragButtonSx,
  dragIconSx,
  skeletonSx,
  cardSx,
  cardHeaderSx,
  chipSx,
  selectedCaptionSx,
  headerRowSx,
  operatorCardSx,
} from "./RuleWrapper.styles";
import { RuleNodeType } from "@/types/rules";
import EditableText from "@/components/EditableText";
import { useLogDependencyChanges } from "@/utils/deps";
import InvalidRule from "@/components/InvalidRule";
import Title from "@/components/Title";
import useRightClickMenu from "@/hooks/useRightClickMenu";
import RightClickMenu from "@/components/RightClickMenu/RightClickMenu";
import { mergeSx } from "@/utils/helpers";
import {
  isAgeFilter,
  isOperator,
  isRuleGroup,
  removeById,
} from "@/utils/rules";
import Close from "@mui/icons-material/Close";
import useHoverable from "@/hooks/useHoverable";
import useNodeActions from "@/hooks/useNodeActions";
import { RenderProp, resolveRenderProp } from "./renderProp";

export interface RuleCardState {
  isSelected: boolean;
  isHighlighted: boolean;
  isDragging: boolean;
  valid: boolean;
  invalidReason: string[];
}

export interface RuleWrapperProps {
  node: RuleNodeType;
  groupId?: string;
  draggable?: boolean;
  renderHeader?: RenderProp<[RuleCardState, ReactNode]>;
  renderSubTitle?: RenderProp<[RuleCardState]>;
  renderContent: RenderProp<[RuleCardState]>;
  renderSubContent?: RenderProp<[RuleCardState]>;
  renderFooter?: RenderProp<[RuleCardState, ReactNode]>;
}

const RuleWrapper = ({
  node,
  groupId,
  draggable = true,
  renderHeader,
  renderSubTitle,
  renderContent,
  renderSubContent,
  renderFooter,
}: RuleWrapperProps) => {
  const { id, valid = true, invalidReason } = node;
  const isOperatorNode = isOperator(node);
  const type = isRuleGroup(node)
    ? DragType.Group
    : isOperatorNode
      ? DragType.Operator
      : DragType.Rule;

  let exclude;
  if (!isAgeFilter(node)) {
    exclude = !!node.exclude;
  }

  const {
    isSelected,
    selectNodeWithModifiers,
    getNodeName,
    setNodeName,
    queryBuilderJson,
    setQueryBuilderJson,
  } = useQueryBuilder((qb) => ({
    isSelected: !!qb.selected[id],
    selectNodeWithModifiers: qb.selectNodeWithModifiers,
    getNodeName: qb.getNodeName,
    setNodeName: qb.setNodeName,
    queryBuilderJson: qb.queryBuilderJson,
    setQueryBuilderJson: qb.setQueryBuilderJson,
  }));

  const {
    setNodeRef,
    style,
    anchorRef,
    anchorSize,
    isDragging,
    attributes,
    listeners,
  } = useSortable({
    id,
    disabled: { draggable: !draggable },
    data: {
      id,
      type,
      groupId,
    },
  });

  const { activeNode } = useCohortBuilderContext();
  const isInDragOverlay = useIsInDragOverlay();
  const isPlaceholder = !isInDragOverlay && activeNode?.id === id;
  const effectiveIsDragging = isDragging || isPlaceholder;

  const { setHoverRef, isHighlighted } = useHoverable<HTMLDivElement>(node.id);

  const setCardRef = useCallback(
    (el: HTMLDivElement) => {
      anchorRef.current = el;
      setHoverRef(el);
    },
    [anchorRef, setHoverRef],
  );

  const [showHandle, setShowHandle] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const handleOnSelect = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      window.getSelection()?.removeAllRanges();

      selectNodeWithModifiers(node, {
        shiftKey: e.shiftKey,
        metaKey: e.metaKey,
      });
    },
    [node, selectNodeWithModifiers],
  );

  const onMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setShowHandle(true);
    setShowDelete(true);
  };

  const onMouseLeave = useCallback(() => {
    if (showHandle && !effectiveIsDragging) {
      setShowHandle(false);
      setShowDelete(false);
    }
  }, [showHandle, effectiveIsDragging, setShowHandle, setShowDelete]);

  const { handleContextMenu, ...rightClickMenuMethods } = useRightClickMenu();
  const { actions } = useNodeActions(node);

  const handleDelete = useCallback(() => {
    const newQuery = removeById(queryBuilderJson, id);
    setQueryBuilderJson(newQuery);
  }, [id, queryBuilderJson, setQueryBuilderJson]);

  const nodeName = useMemo(() => getNodeName(node), [node, getNodeName]);

  const state: RuleCardState = {
    isSelected,
    isHighlighted,
    isDragging: effectiveIsDragging,
    valid,
    invalidReason: invalidReason ?? [],
  };

  const defaultHeader = (
    <CardHeader
      sx={cardHeaderSx}
      slotProps={{
        title: {
          component: "h2",
          variant: "h5",
        },
      }}
      title={
        <Box width={"100%"} display={"flex"} justifyContent={"space-between"}>
          <Box display={"flex"}>
            {exclude !== undefined && (
              <Chip
                color={exclude == true ? "error" : "primary"}
                sx={chipSx}
                variant="outlined"
                label={exclude == true ? "Exclude" : "Include"}
              />
            )}
          </Box>
          <Title
            size={"small"}
            title={type}
            subTitle={resolveRenderProp(renderSubTitle, state)}
          />
        </Box>
      }
    />
  );

  const defaultFooter =
    !isOperatorNode && !valid && state.invalidReason.length > 0 ? (
      <InvalidRule
        reasons={state.invalidReason}
        stackProps={{ sx: { pt: 1, pb: 1 } }}
      />
    ) : null;

  const header =
    renderHeader === undefined
      ? defaultHeader
      : resolveRenderProp(renderHeader, state, defaultHeader);

  const footer =
    renderFooter === undefined
      ? defaultFooter
      : resolveRenderProp(renderFooter, state, defaultFooter);

  useLogDependencyChanges("wrapper " + node.id, {
    isSelected,
    node,
    groupId,
    exclude,
    valid,
    handleContextMenu,
    onMouseLeave,
    onMouseEnter,
    handleOnSelect,
    showHandle,
    setNodeRef,
    style,
    anchorRef,
    anchorSize,
    isDragging,
    attributes,
    listeners,
    cardHeaderSx,
    headerRowSx,
  });

  return (
    <Box
      rule-id={id}
      data-testid="sortable-rule"
      ref={setNodeRef}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      sx={containerSx(isSelected && !effectiveIsDragging)}
    >
      <Box sx={headerRowSx}>
        <Collapse
          in={
            draggable && (showHandle || isInDragOverlay || effectiveIsDragging)
          }
          orientation="horizontal"
          collapsedSize={0}
          unmountOnExit
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Fade
            in={
              draggable &&
              (showHandle || isInDragOverlay || effectiveIsDragging)
            }
          >
            <IconButton
              aria-label="Drag"
              data-draggable="true"
              size="small"
              {...attributes}
              {...listeners}
              sx={dragButtonSx}
            >
              <DragIndicator
                fontSize="small"
                sx={dragIconSx(effectiveIsDragging)}
              />
            </IconButton>
          </Fade>
        </Collapse>
        {effectiveIsDragging ? (
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={skeletonSx(anchorSize.width, anchorSize.height)}
          />
        ) : (
          <Card
            ref={setCardRef}
            data-id={id}
            data-selectable="true"
            data-draggable="true"
            component="div"
            data-testid="clickable-card"
            sx={mergeSx(
              cardSx(isSelected, valid, isHighlighted),
              isOperatorNode
                ? operatorCardSx(isSelected, isHighlighted)
                : undefined,
            )}
            onContextMenu={handleContextMenu}
            onClick={handleOnSelect}
          >
            {header}

            <CardContent>{resolveRenderProp(renderContent, state)}</CardContent>

            {resolveRenderProp(renderSubContent, state)}

            <RightClickMenu {...rightClickMenuMethods} actions={actions} />
            {footer && (
              <>
                <Divider variant="fullWidth" />
                {footer}
              </>
            )}
          </Card>
        )}

        {isOperatorNode && (
          <Collapse
            in={showHandle || isInDragOverlay || effectiveIsDragging}
            orientation="horizontal"
            collapsedSize={0}
            unmountOnExit
            sx={{ display: "flex", alignItems: "center" }}
          >
            <IconButton aria-label="Drag" size="small" sx={{ opacity: 0 }}>
              <DragIndicator
                fontSize="small"
                sx={dragIconSx(effectiveIsDragging)}
              />
            </IconButton>
          </Collapse>
        )}
        <Collapse
          in={showDelete || isInDragOverlay}
          orientation="horizontal"
          collapsedSize={0}
          unmountOnExit
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Fade in={showDelete || isInDragOverlay}>
            <IconButton
              aria-label="Delete"
              size="small"
              {...attributes}
              {...listeners}
              sx={deleteButtonSx}
              onClick={handleDelete}
            >
              <Close fontSize="medium" sx={deleteIconSx(effectiveIsDragging)} />
            </IconButton>
          </Fade>
        </Collapse>
      </Box>
      {isSelected && (
        <EditableText
          defaultValue={nodeName}
          onCommit={(name) => setNodeName(node, name)}
          typographyProps={{
            component: "span",
            variant: "caption",
            sx: selectedCaptionSx,
          }}
          textFieldProps={{
            variant: "standard",
            size: "small",
            margin: "dense",
            InputProps: { disableUnderline: true },
            sx: {
              p: 0,
              m: 0,
              "& .MuiInputBase-root": {
                fontSize: "inherit",
                lineHeight: "inherit",
              },
              "& .MuiInputBase-input": {
                fontSize: "inherit",
                lineHeight: "inherit",
                paddingTop: 0,
                paddingBottom: 0,
              },
            },
          }}
        />
      )}
    </Box>
  );
};

export default RuleWrapper;
