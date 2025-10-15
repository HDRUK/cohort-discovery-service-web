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
} from "@mui/material";
import { ReactNode, RefObject, useMemo, useState } from "react";
import useSortable from "@/hooks/useSortable";
import { UseSortablePlusReturn } from "@/hooks/useSortable";
import { DragIndicator } from "@mui/icons-material";
import { useDaphneStore } from "@/store/useDaphneStore";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import {
  containerSx,
  headerRowSx,
  leftControlsSx,
  dragButtonSx,
  dragIconSx,
  skeletonSx,
  cardSx,
  cardHeaderSx,
  chipSx,
  headerActionSx,
  selectedCaptionSx,
} from "./RuleWrapper.styles";

interface Action {
  action: () => void;
  label: string;
}

export interface RuleWrapperProps extends BoxProps {
  id: string;
  type: "Rule" | "Group" | "Operator";
  headerExtra?: ReactNode;
  hideHeader?: boolean;
  groupId: string;
  sortable?: boolean;
  valid?: boolean;
  exclude?: boolean;
  cardProps?: CardProps;
  render: (
    ref: RefObject<HTMLDivElement | null>,
    props: UseSortablePlusReturn
  ) => ReactNode;
  actions?: Action[];
}

const RuleWrapper = ({
  id,
  type,
  groupId,
  headerExtra,
  hideHeader = false,
  sortable = true,
  valid = true,
  exclude = false,
  cardProps = {},
  render,
  actions,
  ...rest
}: RuleWrapperProps) => {
  const {
    queryBuilder: { selected, toggleSelected },
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

  const {
    setNodeRef,
    style,
    anchorRef,
    anchorSize,
    isDragging,
    attributes,
    listeners,
  } = params;

  return (
    <Box
      data-testid="sortable-rule"
      onClick={() => {
        toggleSelected(id);
      }}
      sx={containerSx(isSelected)}
      ref={setNodeRef}
      style={sortable ? style : {}}
      {...rest}
    >
      <Box sx={headerRowSx}>
        <Box sx={leftControlsSx}>
          <IconButton
            aria-label="Drag"
            size="small"
            {...(sortable ? attributes : {})}
            {...(sortable ? listeners : {})}
            sx={dragButtonSx}
          >
            <DragIndicator fontSize="small" sx={dragIconSx(isDragging)} />
          </IconButton>
        </Box>

        {isDragging ? (
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={skeletonSx(anchorSize.width, anchorSize.height)}
          />
        ) : (
          <Card
            data-testid="clickable-card"
            ref={anchorRef}
            sx={cardSx(valid)}
            onContextMenu={handleContextMenu}
            onClick={(e) => e.stopPropagation()}
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

            <CardContent>{render(anchorRef, params)}</CardContent>

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
      </Box>

      {isSelected && (
        <Typography variant="caption" component="span" sx={selectedCaptionSx}>
          {id}
        </Typography>
      )}
    </Box>
  );
};

export default RuleWrapper;
