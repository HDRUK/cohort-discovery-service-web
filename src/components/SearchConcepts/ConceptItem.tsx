import { Concept } from "@/types/api";
import {
  Paper,
  FormControlLabel,
  Checkbox,
  PaperProps,
  Box,
  Typography,
  Chip,
  Stack,
  Tooltip,
} from "@mui/material";
import Title from "../Title";
import { mapDomain } from "@/utils/domains";
import { ChangeEvent, MouseEvent } from "react";

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
  const titleText = showCode ? (
    <Typography>
      {concept.name} (
      <Box component="span" sx={{ color: "grey.500" }}>
        OMOP
      </Box>{" "}
      {id})
    </Typography>
  ) : (
    concept.name
  );

  const labelEl = (
    <Title
      size="small"
      useSeparator={false}
      title={titleText}
      subTitle={showDomain ? mapDomain(concept.category) : ""}
      display={"flex"}
      justifyContent={"space-between"}
      width={"100%"}
    />
  );

  return (
    <ConceptWrapper
      isSelected={isSelected}
      onClick={!multiple ? (e) => handleClick(id, e) : undefined}
    >
      {multiple ? (
        <FormControlLabel
          sx={{ p: 0, m: 0, width: "100%" }}
          control={
            <Checkbox
              checked={isSelected}
              onChange={(e) => handleClick(id, e)}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            />
          }
          label={labelEl}
        />
      ) : (
        labelEl
      )}
      {showCounts && (
        <Stack sx={{ ml: "auto" }} gap={1} direction={"row"}>
          <Tooltip title="Number of datasets present in">
            <Chip color="success" label={concept.ncollections} />
          </Tooltip>
          <Tooltip title="Total number of counts for this concept">
            <Chip
              color="secondary"
              label={Number(concept.count).toLocaleString()}
            />
          </Tooltip>
        </Stack>
      )}
    </ConceptWrapper>
  );
};
