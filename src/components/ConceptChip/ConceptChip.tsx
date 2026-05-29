import { Concept } from "@/types/api";
import { Box, Chip, ChipProps, IconButton, Typography } from "@mui/material";
import { getDomain } from "@/utils/omop";
import { DragIndicator } from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Cancel";
import SyntheticChip from "../SyntheticChip";
import { useDraggable } from "@dnd-kit/core";

export type DraggableConfig = {
  id: string;
  data: Record<string, unknown>;
};

const ParentWrapper = ({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) => {
  if (!active) {
    return <>{children} </>;
  }

  return (
    <Box
      sx={{
        border: 1,
        p: 0.5,
        px: 1,
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        Parent Condition
      </Typography>
      {children}
    </Box>
  );
};

export const ConceptChip = ({
  indicateIfParent = false,
  draggable = false,
  concept,
  onClick,
  onDelete,
  chipSx,
  children,
}: {
  draggable?: boolean | DraggableConfig;
  indicateIfParent?: boolean;
  concept: Concept;
  onClick?: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  chipSx?: ChipProps["sx"];
  children?: React.ReactNode;
}) => {
  const draggableConfig = typeof draggable === "object" ? draggable : null;
  const { setNodeRef, listeners, attributes, isDragging } = useDraggable({
    id: draggableConfig?.id ?? `nondraggable-${concept.concept_id}`,
    data: draggableConfig?.data ?? {},
    disabled: !draggableConfig,
  });

  const categoryLabel = getDomain(concept);
  const isParent = (concept?.children?.length ?? 0) > 0;
  const clickable = Boolean(onClick);

  return (
    <Box
      ref={draggableConfig ? setNodeRef : undefined}
      role={clickable ? "button" : undefined}
      sx={{ display: "flex", alignItems: "center", opacity: isDragging ? 0.4 : 1 }}
    >
      {draggable && (
        <IconButton {...listeners} {...attributes}>
          <DragIndicator fontSize="small" sx={{ cursor: "grab", mt: 0.25 }} />
        </IconButton>
      )}
      <ParentWrapper active={indicateIfParent && isParent}>
        <SyntheticChip
          isSynthetic={concept?.all_synthetic === 1}
          title="This concept is only available in synthetic data"
          sx={{ mr: 1 }}
        />
        <Chip
          sx={{
            bgcolor: indicateIfParent && isParent ? "secondary.main" : "white",
            color:
              indicateIfParent && isParent ? "secondary.contrastText" : "inherit",
            p: 2,
            borderRadius: 10,
            ...(clickable && {
              "&:hover": { boxShadow: 2, backgroundColor: "action.hover" },
            }),
            cursor: onClick ? "pointer" : "default",
            ...chipSx,
          }}
          onClick={onClick && onClick}
          label={
            <Typography>
              {categoryLabel && (
                <Box component="span" sx={{ color: "grey.500" }}>
                  {`${categoryLabel} | `}
                </Box>
              )}
              {concept?.name} (
              <Box component="span" sx={{ color: "grey.500" }}>
                OMOP
              </Box>{" "}
              {concept.concept_id})
            </Typography>
          }
          variant="outlined"
        />
      </ParentWrapper>
      <IconButton onClick={onDelete}>
        <CancelIcon />
      </IconButton>
      {children}
    </Box>
  );
};
