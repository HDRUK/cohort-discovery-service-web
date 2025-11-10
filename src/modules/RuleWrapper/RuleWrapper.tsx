import {
  Typography,
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
} from "@mui/material";
import { ReactNode, RefObject, useCallback, useMemo, useState } from "react";
import useSortable from "@/hooks/useSortable";
import { UseSortablePlusReturn } from "@/hooks/useSortable";
import { DragIndicator } from "@mui/icons-material";
import { useDaphneStore } from "@/store/useDaphneStore";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import {
  containerSx,
  dragButtonSx,
  dragIconSx,
  skeletonSx,
  cardSx,
  cardHeaderSx,
  chipSx,
  headerActionSx,
  selectedCaptionSx,
  headerRowSx,
} from "./RuleWrapper.styles";
import { TRIGGER_GUTTER_PX } from "@/config/defaults";
import { RuleNodeType } from "@/types/rules";
import EditableText from "@/components/EditableText";

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
  valid?: boolean;
  exclude?: boolean;
  cardProps?: CardProps;
  containerProps?: BoxProps;
  render: (
    rule: RuleNodeType,
    ref: RefObject<HTMLDivElement | HTMLLIElement | null>,
    props: UseSortablePlusReturn,
    handleShown?: boolean
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
  valid = true,
  exclude = false,
  cardProps = {},
  containerProps = {},
  render,
  actions,
  forceShowHandle = false,
  useLeftDragPlaceHolder = false,
}: RuleWrapperProps) => {
  const { id } = node;

  const {
    queryBuilder: { selected, toggleSelected, getNodeName, setNodeName },
  } = useDaphneStore();

  const isSelected = useMemo(() => selected?.[id] ?? false, [selected, id]);

  const params = useSortable({
    id,
    data: {
      id,
      type,
      groupId,
    },
  });

  const {
    setNodeRef,
    style,
    anchorRef,
    anchorSize,
    isDragging,
    attributes,
    listeners,
  } = params;

  const [showHandle, setShowHandle] = useState(false);

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

  const onMouseLeave = () => {
    if (showHandle && !isDragging) {
      setShowHandle(false);
    }
  };

  const [menuPos, setMenuPos] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
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
  };

  const handleClose = () => setMenuPos(null);

  const nodeName = useMemo(() => getNodeName(node), [node, getNodeName]);

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
            data-id={id}
            data-selectable="true"
            data-draggable="false"
            component="div"
            ref={anchorRef}
            data-testid="clickable-card"
            sx={cardSx(valid)}
            onContextMenu={handleContextMenu}
            onClick={(e: React.MouseEvent) => {
              toggleSelected(id);
              e.stopPropagation();
            }}
            {...cardProps}
          >
            {!hideHeader && (
              <CardHeader
                sx={cardHeaderSx}
                avatar={
                  <>
                    <Chip
                      color={exclude ? "error" : "primary"}
                      sx={chipSx}
                      variant="outlined"
                      label={exclude ? "Exclude" : "Include"}
                    />
                    {!valid && <WarningAmberIcon color="warning" />}
                  </>
                }
                action={
                  <Box sx={headerActionSx}>
                    <Typography variant="h5">{type}</Typography>
                    {headerExtra}
                  </Box>
                }
              />
            )}

            <CardContent>
              {render(node, anchorRef, params, showHandle)}
            </CardContent>

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
