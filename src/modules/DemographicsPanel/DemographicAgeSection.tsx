"use client";

import { Box, Chip } from "@mui/material";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import { MAX_AGE_FILTER, MIN_AGE_FILTER } from "@/config/rules";
import AgeRangeInput from "@/components/RuleAgeSelector/AgeRangeInput";
import DemographicRow from "./DemographicRow";
import { formatAgeSummary } from "./summary";

const DEFAULT_AGE_RANGE: [number, number] = [MIN_AGE_FILTER, MAX_AGE_FILTER];

const DemographicAgeSection = () => {
  const { age, setAge } = useQueryBuilder((qb) => ({
    age: qb.queryBuilderJson.demographics?.age ?? null,
    setAge: qb.setDemographicsAge,
  }));

  const handleEdit = () => {
    if (!age) setAge(DEFAULT_AGE_RANGE);
  };

  const handleClear = () => {
    setAge(null);
  };

  return (
    <DemographicRow
      label="Age"
      onEdit={handleEdit}
      onClear={handleClear}
      showClear={age !== null}
      renderEditing={
        <Box minWidth={350} maxWidth={400}>
          {age && (
            <AgeRangeInput
              value={age}
              minAge={MIN_AGE_FILTER}
              maxAge={MAX_AGE_FILTER}
              onChange={setAge}
              sx={{ flex: 1, py: 1 }}
            />
          )}
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
