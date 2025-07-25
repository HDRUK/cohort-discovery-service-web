"use client";

import { useForm, Controller } from "react-hook-form";
import { TextField, Box, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useDaphneStore } from "../store/useDaphneStore";

type FormValues = {
  cohortQueryInput: string;
};

const CohortQueryInput = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>();

  const { getQuery } = useDaphneStore();

  const onSubmit = (data: FormValues) => {
    getQuery(data.cohortQueryInput);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        width: "70%",
        my: 10,
      }}
    >
      <Controller
        name="cohortQueryInput"
        control={control}
        defaultValue=""
        rules={{ required: "Query is required" }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Cohort Query"
            placeholder="Search for a cohort e.g. females above 50 with diabetes type-ii"
            fullWidth
            variant="outlined"
            margin="normal"
            error={!!errors.cohortQueryInput}
            helperText={errors.cohortQueryInput?.message}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit(onSubmit)();
              }
            }}
          />
        )}
      />
    </Box>
  );
};

export default CohortQueryInput;
