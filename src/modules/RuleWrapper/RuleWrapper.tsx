import { Typography, Box, BoxProps, IconButton, Skeleton } from "@mui/material";
import { ReactNode, RefObject, useMemo } from "react";
import useSortable from "@/hooks/useSortable";
import { UseSortablePlusReturn } from "@/hooks/useSortable";
import { DragIndicator } from "@mui/icons-material";
import { useDaphneStore } from "@/store/useDaphneStore";

export interface RuleWrapperProps extends BoxProps {
  id: string;
  sortable?: boolean;
  render: (
    ref: RefObject<HTMLDivElement | null>,
    props: UseSortablePlusReturn
  ) => ReactNode;
}

const RuleWrapper = ({
  id,
  sortable = true,
  render,
  ...rest
}: RuleWrapperProps) => {
  const {
    queryBuilder: { selected, toggleSelected },
  } = useDaphneStore();

  const isSelected = useMemo(() => selected?.[id] ?? false, [selected, id]);

  const params = useSortable(id);

  const { setNodeRef, style, anchorRef, anchorSize } = params;

  return (
    <Box
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
          render(anchorRef, params)
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
