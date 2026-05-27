"use client";

import { Autocomplete, Chip, TextField } from "@mui/material";
import { DemographicFilterType } from "@/types/rules";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import { isDemographicFilter, updateById } from "@/utils/rules";

interface LocationSelectorProps {
  rule: DemographicFilterType;
}

const LocationSelector = ({ rule }: LocationSelectorProps) => {
  const { queryBuilderJson, setQueryBuilderJson } = useQueryBuilder((qb) => ({
    queryBuilderJson: qb.queryBuilderJson,
    setQueryBuilderJson: qb.setQueryBuilderJson,
  }));

  const handleChange = (_: React.SyntheticEvent, values: string[]) => {
    setQueryBuilderJson(
      updateById(queryBuilderJson, rule.id, (node) => {
        if (!isDemographicFilter(node)) return node;
        return { ...node, location: values.length ? values : undefined };
      }),
    );
  };

  return (
    <Autocomplete
      multiple
      freeSolo
      options={[]}
      value={rule.location ?? []}
      onChange={handleChange}
      renderTags={(values, getTagProps) =>
        values.map((value, index) => (
          <Chip label={value} size="small" {...getTagProps({ index })} key={value} />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          label="Location"
          placeholder={rule.location?.length ? undefined : "e.g. England"}
          sx={{ my: 1 }}
        />
      )}
    />
  );
};

export default LocationSelector;
