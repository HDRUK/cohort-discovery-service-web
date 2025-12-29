import { Concept } from "@/types/api";
import { Box, Chip, ChipProps, IconButton, Typography } from "@mui/material";
import { DragIndicator } from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Cancel";

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
  draggable?: boolean;
  indicateIfParent?: boolean;
  concept: Concept;
  onClick?: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  chipSx?: ChipProps["sx"];
  children?: React.ReactNode;
}) => {
  const isParent = (concept?.children?.length ?? 0) > 0;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        cursor: onClick ? "pointer" : "default",
      }}
      onClick={onClick && onClick}
    >
      {draggable && (
        <IconButton>
          <DragIndicator fontSize="small" sx={{ cursor: "grab", mt: 0.25 }} />
        </IconButton>
      )}
      <ParentWrapper active={indicateIfParent && isParent}>
        <Chip
          sx={{
            bgcolor: indicateIfParent && isParent ? "secondary.main" : "white",
            color:
              indicateIfParent && isParent
                ? "secondary.contrastText"
                : "inherit",
            p: 2,
            borderRadius: 10,
            ...chipSx,
          }}
          label={concept?.description}
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
