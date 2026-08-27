"use client";

import { Controller, useFormContext } from "react-hook-form";
import {
  Button,
  Chip,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
} from "@mui/material";
import SquareCheckbox from "@/components/SquareCheckbox";
import { Concept, TermDirectoryEntry } from "@/types/api";
import { Demographics } from "@/types/rules";
import {
  demographicGuidance,
  demographicOptionToConcept,
} from "@/config/demographics";
import DemographicRow, { DemographicRowActionProps } from "./DemographicRow";
import { capitaliseFirstLetter } from "@/utils/string";

// Above this many options the checkboxes flow into a scrollable multi-column
// grid; at or below it they stay as a simple single column.
const MULTI_COLUMN_THRESHOLD = 10;

// How many selected chips to show in the collapsed summary before collapsing
// the rest into a "+N more" chip.
const MAX_VISIBLE_CHIPS = 6;

interface DemographicCheckboxSectionProps extends DemographicRowActionProps {
  label: string;
  field: "sex" | "race";
  options: TermDirectoryEntry[];
  selected: Concept[];
}

const DemographicCheckboxSection = ({
  label,
  field,
  options,
  selected,
  ...actionProps
}: DemographicCheckboxSectionProps) => {
  const { control } = useFormContext<Demographics>();
  const note = demographicGuidance(label.toLowerCase());

  const sortedOptions = [...options].sort((a, b) =>
    a.concept_name.localeCompare(b.concept_name, undefined, {
      sensitivity: "base",
    }),
  );

  const isMultiColumn = options.length > MULTI_COLUMN_THRESHOLD;

  return (
    <DemographicRow
      label={label}
      {...actionProps}
      showClear={selected.length > 0}
      renderEditing={
        options.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {`No ${label.toLowerCase()} options are available — the collections you have selected do not contain this data.`}
          </Typography>
        ) : (
          <Controller
            name={field}
            control={control}
            render={({ field: draftField }) => {
              const draft = draftField.value;
              const isChecked = (conceptId: number) =>
                draft.some((c) => c.concept_id === conceptId);
              const allSelected =
                options.length > 0 && options.every((o) => isChecked(o.concept_id));

              const handleToggleAll = () =>
                draftField.onChange(
                  allSelected
                    ? []
                    : sortedOptions.map(demographicOptionToConcept),
                );

              const handleToggle = (concept: Concept, checked: boolean) =>
                draftField.onChange(
                  checked
                    ? [
                        ...draft.filter(
                          (c) => c.concept_id !== concept.concept_id,
                        ),
                        concept,
                      ]
                    : draft.filter((c) => c.concept_id !== concept.concept_id),
                );

              return (
                <>
                  {isMultiColumn && (
                    <Button
                      variant="text"
                      size="small"
                      color="secondary"
                      onClick={handleToggleAll}
                      sx={{ alignSelf: "flex-start", mb: 0.5 }}
                    >
                      {allSelected ? "Deselect all" : "Select all"}
                    </Button>
                  )}
                  <FormGroup
                    sx={
                      isMultiColumn
                        ? {
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fill, minmax(220px, 1fr))",
                            width: "100%",
                            maxHeight: 400,
                            overflowY: "auto",
                            pr: 1,
                          }
                        : undefined
                    }
                  >
                    {sortedOptions.map((option) => (
                      <FormControlLabel
                        key={option.concept_id}
                        sx={{
                          minWidth: 0,
                          alignItems: "flex-start",
                          "& .MuiFormControlLabel-label": {
                            mt: "9px",
                            whiteSpace: "normal",
                            overflowWrap: "anywhere",
                          },
                        }}
                        control={
                          <SquareCheckbox
                            checked={isChecked(option.concept_id)}
                            onChange={(_e, checked) =>
                              handleToggle(
                                demographicOptionToConcept(option),
                                checked,
                              )
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
              );
            }}
          />
        )
      }
    >
      {selected.length > 0 ? (
        <Stack direction="row" flexWrap="wrap" gap={0.5}>
          {selected.slice(0, MAX_VISIBLE_CHIPS).map((c) => (
            <Chip
              key={c.concept_id}
              variant="outlined"
              sx={{ bgcolor: "white" }}
              label={capitaliseFirstLetter(c.name.toLocaleLowerCase())}
            />
          ))}
          {selected.length > MAX_VISIBLE_CHIPS && (
            <Chip
              variant="outlined"
              sx={{ bgcolor: "white" }}
              label={`+${selected.length - MAX_VISIBLE_CHIPS} more`}
            />
          )}
        </Stack>
      ) : (
        <Chip variant="outlined" sx={{ bgcolor: "white" }} label="Any" />
      )}
    </DemographicRow>
  );
};

export default DemographicCheckboxSection;
