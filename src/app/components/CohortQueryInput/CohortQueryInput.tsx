"use client";

import { useForm, Controller } from "react-hook-form";
import { TextField, Box, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useDaphneStore } from "@/store/useDaphneStore";
import { getNaturalLanguage } from "@/utils/queryBuilder";
import { useEffect, useMemo } from "react";
import { Field } from "react-querybuilder";
import { OmopTableName } from "@/types/omop";
import { Option } from "@/types/api";
import SearchBox from "../SearchBox";

type FormValues = {
  cohortQueryInput: string;
};

const CohortQueryInput = ({ fields }: { fields: Field[] }) => {
  const {
    stateManagement: { isLoading },
  } = useDaphneStore();

  const { handleSubmit, control, setValue } = useForm<FormValues>();

  const {
    queryBuilder: { queryBuilderJson, getQueryFromText },
    omop: { setOmop },
  } = useDaphneStore();

  const omop = useMemo(() => {
    return fields.reduce((acc, item) => {
      acc[item.name] = item.values;
      return acc;
    }, {} as Record<OmopTableName, Option[]>);
  }, [fields]);

  useEffect(() => {
    setOmop(omop);
  }, [setOmop, omop]);

  const onSubmit = (data: FormValues) => {
    getQueryFromText(data.cohortQueryInput);
  };

  useEffect(() => {
    const naturalQuery = getNaturalLanguage(queryBuilderJson, fields);
    setValue("cohortQueryInput", naturalQuery);
  }, [queryBuilderJson, setValue, fields]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        width: "95%",
        my: 2,
      }}
    >
      <Controller
        name="cohortQueryInput"
        control={control}
        defaultValue=""
        rules={{ required: "Query is required" }}
        render={({ field, fieldState: { error } }) => (
          <SearchBox
            {...field}
            error={!!error}
            helperText={error?.message}
            type="search"
            placeholder="Search for a cohort e.g. females above 50 with diabetes type-ii"
            fullWidth
            variant="outlined"
            margin="normal"
            onSubmit={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={isLoading}
          />
        )}
      />
    </Box>
  );
};

export default CohortQueryInput;
