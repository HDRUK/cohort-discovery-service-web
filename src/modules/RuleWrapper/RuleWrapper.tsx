import {
  Box,
  BoxProps,
  IconButton,
  Skeleton,
  Card,
  CardHeader,
  Chip,
  CardContent,
  CardProps,
  Collapse,
  CardActions,
  Fade,
  Divider,
} from "@mui/material";
import { ReactNode, RefObject, useCallback, useMemo, useState } from "react";
import useSortable from "@/hooks/useSortable";
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
  cardActionsSx,
  chipSx,
  selectedCaptionSx,
  headerRowSx,
} from "./RuleWrapper.styles";
import { RuleNodeType } from "@/types/rules";
import EditableText from "@/components/EditableText";
import { useLogDependencyChanges } from "@/utils/deps";
import RuleTimeframeSelector from "@/components/RuleTimeframeSelector";
import InvalidRule from "@/components/InvalidRule";
import Title from "@/components/Title";
import useRightClickMenu from "@/hooks/useRightClickMenu";
import RightClickMenu from "@/components/RightClickMenu/RightClickMenu";
import { mergeSx } from "@/utils/helpers";
import RuleAgeSelector from "@/components/RuleAgeSelector";
import {
  isAgeFilter,
  isRuleGroup,
  isRuleLeaf,
  removeById,
} from "@/utils/rules";
import useFeatures from "@/hooks/useFeatures";
import Close from "@mui/icons-material/Close";

interface Action {
  action: () => void;
  label: string;
}

export interface RuleWrapperProps extends BoxProps {
  node: RuleNodeType;
  type: "Rule" | "Group" | "Operator";
  headerExtra?: ReactNode;
  hideHeader?: boolean;
  renderInHeader?: boolean;
  groupId?: string;
  sortable?: boolean;
  cardProps?: CardProps;
  containerProps?: BoxProps;
  render: (
    rule: RuleNodeType,
    ref?: RefObject<HTMLDivElement | HTMLLIElement | null>,
  ) => ReactNode;
  actions?: Action[];
  forceShowHandle?: boolean;
  useLeftDragPlaceHolder?: boolean;
}

const RuleWrapper = ({
  node,
  type,
  groupId,
  headerExtra,
  hideHeader = false,
  renderInHeader = false,
  sortable = true,
  cardProps: { sx: cardPropsSx, ...cardProps } = {},
  containerProps = undefined,
  render,
  actions,
  forceShowHandle = false,
  useLeftDragPlaceHolder = false,
}: RuleWrapperProps) => {
  const { id, valid = true, invalidReason } = node;

  let exclude;
  if (!isAgeFilter(node)) {
    exclude = !!node.exclude;
  }

  const {
    select,
    deselect,
    isSelected,
    toggleSelected,
    getNodeName,
    setNodeName,
    queryBuilderJson,
    setQueryBuilderJson,
    setHovered,
  } = useQueryBuilder((qb) => ({
    select: qb.select,
    deselect: qb.deselect,
    isSelected: !!qb.selected[id],
    toggleSelected: qb.toggleSelected,
    getNodeName: qb.getNodeName,
    setNodeName: qb.setNodeName,
    queryBuilderJson: qb.queryBuilderJson,
    setQueryBuilderJson: qb.setQueryBuilderJson,
    setHovered: qb.setHovered,
  }));

  const { constrainForBunnyV1 } = useFeatures();

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
    data: {
      id,
      type,
      groupId,
    },
  });

  const [showHandle, setShowHandle] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const handleOnSelect = useCallback(
    (e: React.MouseEvent) => {
      const isShift = e.shiftKey;
      e.preventDefault();
      e.stopPropagation();
      window.getSelection()?.removeAllRanges();
      toggleSelected(id, !isShift);

      const isMeta = e.metaKey;
      if (isRuleGroup(node) && isMeta) {
        const nextParent = !isSelected;
        node.rules.forEach((r) => {
          if (nextParent) {
            select(r.id);
          } else {
            deselect(r.id);
          }
        });
      }
    },
    [id, toggleSelected, isSelected],
  );

  const onMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setShowHandle(true);
    setShowDelete(true);
  };

  const onMouseLeave = useCallback(() => {
    if (showHandle && !isDragging && !isSelected) {
      setShowHandle(false);
      setShowDelete(false);
    }
  }, [showHandle, isDragging, isSelected, setShowHandle, setShowDelete]);

  const onCardMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setHovered(id);
  };

  const onCardMouseLeave = useCallback(() => {
    setHovered(id, true);
  }, [id, setHovered]);

  const { handleContextMenu, ...rightClickMenuMethods } = useRightClickMenu();

  const handleDelete = useCallback(() => {
    const newQuery = removeById(queryBuilderJson, id);
    setQueryBuilderJson(newQuery);
  }, [id, queryBuilderJson, setQueryBuilderJson]);

  const nodeName = useMemo(() => getNodeName(node), [node, getNodeName]);

  useLogDependencyChanges("wrapper " + node.id, {
    isSelected,
    node,
    groupId,
    exclude,
    valid,
    handleContextMenu,
    onMouseLeave,
    onMouseOver,
    onCardMouseOver,
    onCardMouseLeave,
    handleOnSelect,
    showHandle,
    setNodeRef,
    style,
    anchorRef,
    anchorSize,
    isDragging,
    attributes,
    listeners,
    containerProps,
    cardHeaderSx,
    cardProps,
    headerRowSx,
  });

  return (
    <Box
      data-testid="sortable-rule"
      ref={setNodeRef}
      style={sortable ? style : {}}
      {...containerProps}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      sx={containerSx(isSelected && !isDragging, containerProps?.sx)}
    >
      <Box sx={headerRowSx}>
        <Collapse
          in={showHandle || forceShowHandle || isDragging}
          orientation="horizontal"
          collapsedSize={0}
          unmountOnExit
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Fade in={showHandle || forceShowHandle || isDragging}>
            <IconButton
              aria-label="Drag"
              data-draggable="true"
              size="small"
              {...(sortable ? attributes : {})}
              {...(sortable ? listeners : {})}
              sx={dragButtonSx}
            >
              <DragIndicator fontSize="small" sx={dragIconSx(isDragging)} />
            </IconButton>
          </Fade>
        </Collapse>
        {isDragging ? (
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={skeletonSx(anchorSize.width, anchorSize.height)}
          />
        ) : (
          <Card
            ref={anchorRef}
            data-id={id}
            data-selectable="true"
            data-draggable="true"
            component="div"
            data-testid="clickable-card"
            sx={mergeSx(cardSx(isSelected, valid), cardPropsSx)}
            onContextMenu={handleContextMenu}
            onClick={handleOnSelect}
            onMouseOver={onCardMouseOver}
            onMouseLeave={onCardMouseLeave}
            {...cardProps}
          >
            {!hideHeader && (
              <CardHeader
                sx={cardHeaderSx}
                slotProps={{
                  title: {
                    component: "h2",
                    variant: "h5",
                  },
                }}
                title={
                  <>
                    <Box
                      width={"100%"}
                      display={"flex"}
                      justifyContent={"space-between"}
                    >
                      <Box display={"flex"}>
                        {exclude !== undefined && (
                          <Chip
                            color={exclude == true ? "error" : "primary"}
                            sx={chipSx}
                            variant="outlined"
                            label={exclude == true ? "Exclude" : "Include"}
                          />
                        )}
                        {!valid && (
                          <InvalidRule reasons={invalidReason ?? []} />
                        )}
                      </Box>
                      <Title
                        size={"small"}
                        title={type}
                        subTitle={headerExtra}
                      />
                    </Box>
                    {renderInHeader && render(node)}
                  </>
                }
              />
            )}

            {!renderInHeader && (
              <CardContent>{render(node, anchorRef)}</CardContent>
            )}

            {isRuleLeaf(node) &&
              (node.timeConstraint || node.ageConstraint) && (
                <CardActions sx={cardActionsSx}>
                  {node.timeConstraint && (
                    <RuleTimeframeSelector rule={node} readOnly />
                  )}
                  {node.ageConstraint && (
                    <RuleAgeSelector
                      rule={node}
                      readOnly
                      uniDirectional={constrainForBunnyV1}
                    />
                  )}
                </CardActions>
              )}

            <RightClickMenu {...rightClickMenuMethods} actions={actions} />
            {type === "Rule" && (
              <>
                <Divider variant="fullWidth" />
                <Box height={40}></Box>
              </>
            )}
          </Card>
        )}

        {useLeftDragPlaceHolder && (
          <Collapse
            in={showHandle || forceShowHandle || isDragging}
            orientation="horizontal"
            collapsedSize={0}
            unmountOnExit
            sx={{ display: "flex", alignItems: "center" }}
          >
            <IconButton aria-label="Drag" size="small" sx={{ opacity: 0 }}>
              <DragIndicator fontSize="small" sx={dragIconSx(isDragging)} />
            </IconButton>
          </Collapse>
        )}
        <Collapse
          in={showDelete || forceShowHandle}
          orientation="horizontal"
          collapsedSize={0}
          unmountOnExit
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Fade in={showDelete || forceShowHandle}>
            <IconButton
              aria-label="Delete"
              size="small"
              {...(sortable ? attributes : {})}
              {...(sortable ? listeners : {})}
              sx={deleteButtonSx}
              onClick={handleDelete}
            >
              <Close fontSize="medium" sx={deleteIconSx(isDragging)} />
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
