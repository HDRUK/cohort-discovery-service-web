import { Concept } from "@/types/api";
import {
  Paper,
  FormControlLabel,
  PaperProps,
  Box,
  Typography,
  Chip,
  Stack,
  Tooltip,
} from "@mui/material";
import { ChangeEvent, MouseEvent } from "react";
import { getDomain } from "@/utils/omop";
import SquareCheckbox from "@/components/SquareCheckbox";

type ConceptSelectEvent =
  | ChangeEvent<HTMLInputElement>
  | MouseEvent<HTMLDivElement>;

export interface ConceptItemProps {
  concept: Concept;
  isSelected: boolean;
  showDomain?: boolean;
  multiple?: boolean;
  showCode?: boolean;
  showCounts?: boolean;
  handleClick: (id: number, e: ConceptSelectEvent) => void;
}

const rowSx: PaperProps["sx"] = {
  display: "flex",
  alignItems: "center",
  py: 1,
  px: 2,
  my: 0.1,
  cursor: "pointer",
  bgcolor: "white",
  "&:hover": { bgcolor: "action.hover" },
  borderRadius: 1,
};

const ConceptWrapper = ({
  isSelected = false,
  onClick,
  children,
}: {
  isSelected: boolean;
  onClick?: (e: ConceptSelectEvent) => void;
  children: React.ReactNode;
}) => (
  <Paper
    data-testid="concept-item"
    sx={{
      ...rowSx,
      bgcolor: !isSelected ? rowSx.bgcolor : "action.hover",
    }}
    onClick={onClick}
  >
    {children}
  </Paper>
);

export const ConceptItem = ({
  concept,
  handleClick,
  isSelected,
  showDomain = true,
  multiple = false,
  showCode = false,
  showCounts = false,
}: ConceptItemProps) => {
  const id = concept.concept_id!;

  const nameEl = (
    <Typography>
      {concept.name}
      {showCode && (
        <>
          {" "}(
          <Box component="span" sx={{ color: "grey.500" }}>
            OMOP
          </Box>{" "}
          {id})
        </>
      )}
    </Typography>
  );

  const rightEl = (showDomain || showCounts) && (
    <Stack
      direction="row"
      alignItems="center"
      gap={1}
      sx={{ ml: "auto", flexShrink: 0, pl: 1 }}
    >
      {showDomain && (
        <Typography variant="body2" color="text.secondary">
          {getDomain(concept)}
        </Typography>
      )}
      {showCounts && (
        <>
          <Tooltip title="Number of datasets present in">
            <Chip color="success" size="small" label={concept.ncollections} />
          </Tooltip>
          <Tooltip title="Total number of counts for this concept">
            <Chip
              color="secondary"
              size="small"
              label={Number(concept.count).toLocaleString()}
            />
          </Tooltip>
        </>
      )}
    </Stack>
  );

  const labelEl = (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>{nameEl}</Box>
      {rightEl}
    </Stack>
  );

  return (
    <ConceptWrapper
      isSelected={isSelected}
      onClick={!multiple ? (e) => handleClick(id, e) : undefined}
    >
      {multiple ? (
        <FormControlLabel
          sx={{ p: 0, m: 0, width: "100%", "& .MuiFormControlLabel-label": { width: "100%" } }}
          control={
            <SquareCheckbox
              checked={isSelected}
              onChange={(e) => handleClick(id, e)}
            />
          }
          label={labelEl}
        />
      ) : (
        labelEl
      )}
    </ConceptWrapper>
  );
};
