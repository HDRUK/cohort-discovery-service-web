import { Concept } from "@/types/api";
import { Paper, FormControlLabel, Checkbox, PaperProps } from "@mui/material";
import Title from "../Title";

export interface ConceptItemProps {
  concept: Concept;
  isSelected: boolean;
  showDomain?: boolean;
  multiple?: boolean;
  showCode?: boolean;
  handleClick: (id: number) => void;
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
  onClick?: () => void;
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
}: ConceptItemProps) => {
  const id = concept.concept_id!;
  const titleText = showCode
    ? `${concept.description} [${id}]`
    : concept.description;

  const labelEl = (
    <Title
      small
      title={titleText}
      subTitle={showDomain ? concept.category : ""}
    />
  );

  return (
    <ConceptWrapper
      isSelected={isSelected}
      onClick={!multiple ? () => handleClick(id) : undefined}
    >
      {multiple ? (
        <FormControlLabel
          sx={{ p: 0, m: 0, width: "100%" }}
          control={
            <Checkbox
              checked={isSelected}
              onChange={() => handleClick(id)}
              onClick={(e) => e.stopPropagation()}
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
