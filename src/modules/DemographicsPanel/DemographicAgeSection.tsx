"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Box, Chip } from "@mui/material";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import { MAX_AGE_FILTER, MIN_AGE_FILTER } from "@/config/rules";
import { Demographics } from "@/types/rules";
import AgeRangeInput from "@/components/RuleAgeSelector/AgeRangeInput";
import DemographicRow, { DemographicRowActionProps } from "./DemographicRow";
import { formatAgeSummary } from "./summary";

const DEFAULT_AGE_RANGE: [number, number] = [MIN_AGE_FILTER, MAX_AGE_FILTER];

const DemographicAgeSection = (props: DemographicRowActionProps) => {
  const { control, setValue } = useFormContext<Demographics>();

  const { age } = useQueryBuilder((qb) => ({
    age: qb.queryBuilderJson.demographics?.age ?? null,
  }));

  const handleEditStart = () => {
    props.onEditStart();
    if (!age) setValue("age", DEFAULT_AGE_RANGE);
  };

  return (
    <DemographicRow
      label="Age"
      {...props}
      onEditStart={handleEditStart}
      showClear={age !== null}
      renderEditing={
        <Box minWidth={350} maxWidth={400}>
          <Controller
            name="age"
            control={control}
            render={({ field }) => (
              <AgeRangeInput
                value={field.value ?? DEFAULT_AGE_RANGE}
                minAge={MIN_AGE_FILTER}
                maxAge={MAX_AGE_FILTER}
                onChange={field.onChange}
                sx={{ flex: 1, py: 1 }}
              />
            )}
          />
        </Box>
      }
    >
      <Chip
        variant="outlined"
        sx={{ bgcolor: "white" }}
        label={formatAgeSummary(age)}
      />
    </DemographicRow>
  );
};

export default DemographicAgeSection;
