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

type SharedProps = {
  indicateIfParent: boolean;
  isParent: boolean;
  clickable: boolean;
  concept: Concept;
  categoryLabel: string | undefined;
  onClick?: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  chipSx?: ChipProps["sx"];
  children?: React.ReactNode;
};

type ConceptChipBaseProps = SharedProps & {
  showHandle?: boolean;
  nodeRef?: (node: HTMLElement | null) => void;
  handleListeners?: ReturnType<typeof useDraggable>["listeners"];
  handleAttributes?: ReturnType<typeof useDraggable>["attributes"];
};

const ConceptChipBase = ({
  showHandle = false,
  nodeRef,
  handleListeners,
  handleAttributes,
  indicateIfParent,
  isParent,
  clickable,
  concept,
  categoryLabel,
  onClick,
  onDelete,
  chipSx,
  children,
}: ConceptChipBaseProps) => (
  <Box
    ref={nodeRef}
    role={clickable ? "button" : undefined}
    sx={{ display: "flex", alignItems: "center" }}
  >
    {showHandle && (
      <IconButton {...handleListeners} {...handleAttributes}>
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

const ConceptChipDraggable = ({
  draggableConfig,
  chipSx,
  ...rest
}: SharedProps & { draggableConfig: DraggableConfig }) => {
  const { setNodeRef, listeners, attributes, isDragging } =
    useDraggable(draggableConfig);
  return (
    <ConceptChipBase
      showHandle
      nodeRef={setNodeRef}
      handleListeners={listeners}
      handleAttributes={attributes}
      chipSx={{ opacity: isDragging ? 0.4 : 1, ...chipSx }}
      {...rest}
    />
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
  const categoryLabel = getDomain(concept);
  const isParent = (concept?.children?.length ?? 0) > 0;
  const clickable = Boolean(onClick);

  const shared: SharedProps = {
    indicateIfParent,
    isParent,
    clickable,
    concept,
    categoryLabel,
    onClick,
    onDelete,
    chipSx,
    children,
  };

  if (draggable && typeof draggable === "object") {
    return <ConceptChipDraggable draggableConfig={draggable} {...shared} />;
  }

  return <ConceptChipBase showHandle={!!draggable} {...shared} />;
};
