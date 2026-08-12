"use client";

import { useState } from "react";
import { Chip } from "@mui/material";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import { MAX_AGE_FILTER, MIN_AGE_FILTER } from "@/config/rules";
import DemographicRow from "./DemographicRow";
import DemographicAgeSelector from "./DemographicAgeSelector";
import { formatAgeSummary } from "./summary";

const DEFAULT_AGE_RANGE: [number, number] = [MIN_AGE_FILTER, MAX_AGE_FILTER];

const DemographicAgeSection = () => {
  const { age, setAge } = useQueryBuilder((qb) => ({
    age: qb.queryBuilderJson.demographics?.age ?? null,
    setAge: qb.setDemographicsAge,
  }));

  const [editing, setEditing] = useState(false);

  const handleEdit = () => {
    if (!age) setAge(DEFAULT_AGE_RANGE);
    setEditing(true);
  };

  const handleClear = () => {
    setAge(null);
    setEditing(false);
  };

  return (
    <DemographicRow
      label="Age"
      onEdit={editing ? undefined : handleEdit}
      onClear={handleClear}
      showClear={age !== null}
    >
      {editing && age ? (
        <DemographicAgeSelector value={age} onChange={setAge} />
      ) : (
        <Chip
          variant="outlined"
          sx={{ bgcolor: "white" }}
          label={formatAgeSummary(age)}
        />
      )}
    </DemographicRow>
  );
};

export default DemographicAgeSection;
