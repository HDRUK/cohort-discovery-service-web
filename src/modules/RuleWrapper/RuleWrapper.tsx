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
  getPrimaryConcept,
  isAgeFilter,
  isEmptyRule,
  isRuleLeaf,
  removeById,
} from "@/utils/rules";
import useFeatures from "@/hooks/useFeatures";
import Close from "@mui/icons-material/Close";
import useHoverable from "@/hooks/useHoverable";
import AddTimeframeButton from "@/components/AddTimeFrameButton";
import AddAgeButton from "@/components/AddAgeButton";
import DeleteAgeButton from "@/components/DeleteAgeButton";
import DeleteTimeFrameButton from "@/components/DeleteTimeFrameButton";

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
  renderFooter?: ReactNode;
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
  renderFooter,
}: RuleWrapperProps) => {
  const { id, valid = true, invalidReason } = node;

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
    if (showHandle && !isDragging) {
      setShowHandle(false);
      setShowDelete(false);
    }
  }, [showHandle, isDragging, setShowHandle, setShowDelete]);

  const { handleContextMenu, ...rightClickMenuMethods } = useRightClickMenu();

  const handleDelete = useCallback(() => {
    const newQuery = removeById(queryBuilderJson, id);
    setQueryBuilderJson(newQuery);
  }, [id, queryBuilderJson, setQueryBuilderJson]);

  const nodeName = useMemo(() => getNodeName(node), [node, getNodeName]);

  const showFooter =
    (type === "Rule" && isSelected && !isAgeFilter(node)) ||
    (!valid && (invalidReason ?? []).length > 0);

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
    containerProps,
    cardHeaderSx,
    cardProps,
    headerRowSx,
  });

  return (
    <Box
      rule-id={id}
      data-testid="sortable-rule"
      ref={setNodeRef}
      style={sortable ? style : {}}
      {...containerProps}
      onMouseEnter={onMouseEnter}
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
            ref={setCardRef}
            data-id={id}
            data-selectable="true"
            data-draggable="true"
            component="div"
            data-testid="clickable-card"
            sx={mergeSx(cardSx(isSelected, valid, isHighlighted), cardPropsSx)}
            onContextMenu={handleContextMenu}
            onClick={handleOnSelect}
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
              type === "Rule" &&
              !isEmptyRule(node) &&
              !renderFooter &&
              !["Gender", "Race"].includes(getPrimaryConcept(node.rule.concept)?.category || "") &&
              (node.timeConstraint || node.ageConstraint || isSelected) && (
                <CardActions sx={cardActionsSx}>
                  {node.timeConstraint ? (
                    <RuleTimeframeSelector
                      data-testid="rule-timeframe-selector"
                      rule={node}
                      readOnly={!isSelected}
                      flex
                    >
                      {isSelected && (
                        <Box sx={{ ml: 1 }}>
                          <DeleteTimeFrameButton rule={node} />
                        </Box>
                      )}
                    </RuleTimeframeSelector>
                  ) : isSelected ? (
                    <AddTimeframeButton
                      label="Add timeframe"
                      rule={node}
                      key="RuleTimeframeSelector"
                      hoverKey={`rule-timeframe-${node.id}`}
                      disabled={!!node.ageConstraint}
                    />
                  ) : null}
                  {node.ageConstraint ? (
                    <RuleAgeSelector
                      rule={node}
                      readOnly={!isSelected}
                      uniDirectional={constrainForBunnyV1}
                      flex
                    >
                      {isSelected && <DeleteAgeButton rule={node} />}
                    </RuleAgeSelector>
                  ) : isSelected ? (
                    <AddAgeButton
                      label="Add age"
                      rule={node}
                      key="RuleAgeSelector"
                      hoverKey={`rule-age-${node.id}`}
                      disabled={!!node.timeConstraint}
                    />
                  ) : null}
                </CardActions>
              )}

            <RightClickMenu {...rightClickMenuMethods} actions={actions} />
            {(type === "Rule" || type === "Group") && (
              <>
                {showFooter && <Divider variant="fullWidth" />}
                <Box
                  minHeight={
                    type === "Rule" && isSelected && !isAgeFilter(node) ? 40 : 0
                  }
                >
                  {(isSelected && renderFooter) || (!valid && (
                    <InvalidRule
                      reasons={invalidReason ?? []}
                      stackProps={{ sx: { pt: 1, pb: 1 } }}
                    />
                  ))}
                </Box>
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
