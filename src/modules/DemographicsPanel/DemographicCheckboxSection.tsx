"use client";

import {
  Chip,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
} from "@mui/material";
import SquareCheckbox from "@/components/SquareCheckbox";
import { Concept, TermDirectoryEntry } from "@/types/api";
import { demographicOptionToConcept } from "@/config/demographics";
import DemographicRow from "./DemographicRow";
import { capitaliseFirstLetter } from "@/utils/string";

interface DemographicCheckboxSectionProps {
  label: string;
  options: TermDirectoryEntry[];
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
        options.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {`No ${label.toLowerCase()} options are available — the collections you have selected do not contain this data.`}
          </Typography>
        ) : (
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
                  label={capitaliseFirstLetter(
                    option.concept_name.toLocaleLowerCase(),
                  )}
                />
              ))}
            </FormGroup>
            {note && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {note}
              </Typography>
            )}
          </>
        )
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
