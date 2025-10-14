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

  const handleClose = () => {
    setMenuPos(null);
  };

  const { setNodeRef, style, anchorRef, anchorSize } = params;

  return (
    <Box
      data-testid="sortable-rule"
      onClick={() => {
        toggleSelected(id);
      }}
      sx={{
        border: 1,
        borderColor: isSelected ? "blue" : "transparent",
        p: 1,
        position: "relative",
      }}
      ref={setNodeRef}
      style={sortable ? style : {}}
      {...rest}
    >
      <Box sx={{ display: "flex", flexDirection: "row", width: "100%" }}>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton
            aria-label="Drag"
            size="small"
            {...(sortable ? params.attributes : {})}
            {...(sortable ? params.listeners : {})}
            sx={{ cursor: "grab", mt: 0.25 }}
          >
            <DragIndicator
              fontSize="small"
              sx={{ opacity: params.isDragging ? 0 : 1 }}
            />
          </IconButton>
        </Box>
        {params.isDragging ? (
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{
              mx: "auto",
              width: anchorSize.width,
              height: anchorSize.height,
            }}
          />
        ) : (
          <Card
            data-testid="clickable-card"
            ref={anchorRef}
            key={id}
            sx={{
              p: 2,
              border: 1,
              borderColor: valid ? "black" : "warning.main",
              width: "100%",
            }}
            onContextMenu={handleContextMenu}
            onClick={(e) => e.stopPropagation()}
            {...cardProps}
          >
            {!hideHeader && (
              <CardHeader
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  p: 0,
                  m: 0,
                  pb: 1,
                }}
                avatar={
                  <>
                    <Chip
                      color={exclude ? "error" : "primary"}
                      sx={{
                        bgcolor: "white",
                      }}
                      variant="outlined"
                      label={exclude ? "Exclude" : "Include"}
                    />
                    {!valid && <WarningAmberIcon color="warning" />}
                  </>
                }
                action={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
        <Typography
          variant="caption"
          component="span"
          sx={{
            zIndex: 1,
            position: "absolute",
            left: "50%",
            bottom: 0,
            transform: "translateX(-50%)",
            px: 0.75,
            py: 0.25,
            lineHeight: 1,
            bgcolor: "blue",
            color: "white",
          }}
        >
          {id}
        </Typography>
      )}
    </Box>
  );
};

export default RuleWrapper;
