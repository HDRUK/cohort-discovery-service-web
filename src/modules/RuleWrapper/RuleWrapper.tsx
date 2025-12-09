import {
  Box,
  BoxProps,
  IconButton,
  Skeleton,
  Card,
  CardHeader,
  Chip,
  CardContent,
  Menu,
  MenuItem,
  CardProps,
  Collapse,
  CardActions,
} from "@mui/material";
import { ReactNode, RefObject, useCallback, useMemo, useState } from "react";
import useSortable from "@/hooks/useSortable";
import { DragIndicator } from "@mui/icons-material";
import useQueryBuilder from "@/store/useQueryBuilder";

import {
  containerSx,
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
import { TRIGGER_GUTTER_PX } from "@/config/defaults";
import { RuleNodeType } from "@/types/rules";
import EditableText from "@/components/EditableText";
import { useLogDependencyChanges } from "@/utils/deps";
import RuleTimeframeSelector from "@/components/RuleTimeframeSelector";
import InvalidRule from "@/components/InvalidRule";
import Title from "@/components/Title";

interface Action {
  action: () => void;
  label: string;
}

export interface RuleWrapperProps extends BoxProps {
  node: RuleNodeType;
  type: "Rule" | "Group" | "Operator";
  headerExtra?: ReactNode;
  hideHeader?: boolean;
  groupId?: string;
  sortable?: boolean;
  cardProps?: CardProps;
  containerProps?: BoxProps;
  render: (
    rule: RuleNodeType,
    ref: RefObject<HTMLDivElement | HTMLLIElement | null>
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
  sortable = true,
  cardProps = undefined,
  containerProps = undefined,
  render,
  actions,
  forceShowHandle = false,
  useLeftDragPlaceHolder = false,
}: RuleWrapperProps) => {
  const { id, valid = true, invalidReason, exclude = false } = node;

  const { isSelected, toggleSelected, getNodeName, setNodeName } =
    useQueryBuilder((qb) => ({
      isSelected: !!qb.selected[id],
      toggleSelected: qb.toggleSelected,
      getNodeName: qb.getNodeName,
      setNodeName: qb.setNodeName,
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
    data: {
      id,
      type,
      groupId,
    },
  });

  const [showHandle, setShowHandle] = useState(false);

  const handleOnSelect = useCallback(
    (e: React.MouseEvent) => {
      toggleSelected(id);
      e.stopPropagation();
    },
    [id, toggleSelected]
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
      const xFromLeft = e.clientX - rect.left;
      const shouldShow = xFromLeft <= TRIGGER_GUTTER_PX;
      if (shouldShow !== showHandle) setShowHandle(shouldShow);
    },
    [showHandle]
  );

  const onMouseLeave = useCallback(() => {
    if (showHandle && !isDragging) {
      setShowHandle(false);
    }
  }, [showHandle, isDragging, setShowHandle]);

  const [menuPos, setMenuPos] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setMenuPos(
        menuPos === null
          ? {
              mouseX: event.clientX + 2,
              mouseY: event.clientY - 6,
            }
          : null
      );
    },
    [menuPos]
  );

  const handleClose = () => setMenuPos(null);

  const nodeName = useMemo(() => getNodeName(node), [node, getNodeName]);

  useLogDependencyChanges("wrapper " + node.id, {
    isSelected,
    node,
    groupId,
    exclude,
    valid,
    handleContextMenu,
    menuPos,
    onMouseLeave,
    onMouseMove,
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
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      sx={containerSx(isSelected, containerProps?.sx)}
    >
      <Box sx={headerRowSx}>
        <Collapse
          in={showHandle || forceShowHandle || isDragging}
          orientation="horizontal"
          collapsedSize={0}
          unmountOnExit
          sx={{ display: "flex", alignItems: "center" }}
        >
          <IconButton
            aria-label="Drag"
            size="small"
            {...(sortable ? attributes : {})}
            {...(sortable ? listeners : {})}
            sx={dragButtonSx}
          >
            <DragIndicator fontSize="small" sx={dragIconSx(isDragging)} />
          </IconButton>
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
            sx={cardSx(isSelected, valid)}
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
                  <Box
                    width={"100%"}
                    display={"flex"}
                    justifyContent={"space-between"}
                  >
                    <Box display={"flex"}>
                      <Chip
                        color={exclude ? "error" : "primary"}
                        sx={chipSx}
                        variant="outlined"
                        label={exclude ? "Exclude" : "Include"}
                      />
                      {!valid && <InvalidRule reasons={invalidReason ?? []} />}
                    </Box>
                    <Title small title={type} subTitle={headerExtra} />
                  </Box>
                }
              />
            )}

            <CardContent>{render(node, anchorRef)}</CardContent>

            {node.timeConstraint && (
              <CardActions sx={cardActionsSx}>
                <RuleTimeframeSelector rule={node} readOnly />
              </CardActions>
            )}

            {actions && (
              <Menu
                open={menuPos !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                  menuPos !== null
                    ? { top: menuPos.mouseY, left: menuPos.mouseX }
                    : undefined
                }
              >
                {actions.map(({ action, label }) => (
                  <MenuItem
                    key={label}
                    onClick={() => {
                      action();
                      handleClose();
                    }}
                  >
                    {label}
                  </MenuItem>
                ))}
              </Menu>
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
      </Box>
      {isSelected && (
        <EditableText
          value={nodeName}
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
