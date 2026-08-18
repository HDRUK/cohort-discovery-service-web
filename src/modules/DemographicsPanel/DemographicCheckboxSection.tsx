"use client";

import {
  Chip,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
} from "@mui/material";
import SquareCheckbox from "@/components/SquareCheckbox";
import { Concept } from "@/types/api";
import {
  DemographicOption,
  demographicOptionToConcept,
} from "@/config/demographics";
import DemographicRow from "./DemographicRow";

interface DemographicCheckboxSectionProps {
  label: string;
  options: DemographicOption[];
  selected: Concept[];
  onToggle: (concept: Concept, selected: boolean) => void;
  onClear: () => void;
  note?: string;
}

const DemographicCheckboxSection = ({
  label,
  options,
  selected,
  onToggle,
  onClear,
  note,
}: DemographicCheckboxSectionProps) => {
  const isChecked = (conceptId: number) =>
    selected.some((c) => c.concept_id === conceptId);

  return (
    <DemographicRow
      label={label}
      onClear={onClear}
      showClear={selected.length > 0}
      renderEditing={
        <>
          <FormGroup>
            {options.map((option) => (
              <FormControlLabel
                key={option.concept_id}
                control={
                  <SquareCheckbox
                    checked={isChecked(option.concept_id)}
                    onChange={(_e, checked) =>
                      onToggle(demographicOptionToConcept(option), checked)
                    }
                  />
                }
                label={option.name}
              />
            ))}
          </FormGroup>
          {note && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {note}
            </Typography>
          )}
        </>
      }
    >
      {selected.length > 0 ? (
        <Stack direction="row" flexWrap="wrap" gap={0.5}>
          {selected.map((c) => (
            <Chip
              key={c.concept_id}
              variant="outlined"
              sx={{ bgcolor: "white" }}
              label={c.name}
            />
          ))}
        </Stack>
      ) : (
        <Chip variant="outlined" sx={{ bgcolor: "white" }} label="Any" />
      )}
    </DemographicRow>
  );
};

export default DemographicCheckboxSection;
