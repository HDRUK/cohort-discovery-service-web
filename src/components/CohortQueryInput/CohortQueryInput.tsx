"use client";

import { useForm, Controller } from "react-hook-form";
import { Box } from "@mui/material";
import { useDaphneStore } from "@/store/useDaphneStore";
import { useEffect } from "react";
import SearchBox from "../SearchBox";
import { WarningAmberOutlined } from "@mui/icons-material";

type FormValues = {
  cohortQueryInput: string;
  queryName: string;
};

const CohortQueryInput = () => {
  const {
    queryBuilder: { queryAsText, getQueryFromText },
    stateManagement: { isLoading },
  } = useDaphneStore();

  const { handleSubmit, control, setValue, setError, clearErrors } =
    useForm<FormValues>({
      defaultValues: {
        cohortQueryInput: queryAsText,
        queryName: "",
      },
    });

  const onSubmit = (data: FormValues) => {
    getQueryFromText(data.cohortQueryInput);
  };

  useEffect(() => {
    clearErrors();
    if (queryAsText === "__invalid__") {
      setValue("cohortQueryInput", "");
      setError("cohortQueryInput", { message: "query builder is invalid" });
      return;
    }
    setValue("cohortQueryInput", queryAsText);
  }, [queryAsText, setValue, setError, clearErrors]);

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
