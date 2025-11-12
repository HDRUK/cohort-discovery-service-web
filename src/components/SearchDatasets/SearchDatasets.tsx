"use client";

import { useForm, Controller } from "react-hook-form";
import { Box } from "@mui/material";
import SearchBox from "../SearchBox";

type FormValues = {
  name: string;
};

// placeholder component for a future ticket..
const SearchDatasets = () => {
  const { handleSubmit, control } = useForm<FormValues>({
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (_data: FormValues) => {
    // to be implemented in another ticket
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        mx: 2,
      }}
    >
      <Controller
        name="name"
        control={control}
        defaultValue=""
        render={({ field, fieldState: { error, isDirty } }) => (
          <SearchBox
            {...field}
            inputBgColor="background.default"
            error={!!error}
            label={!isDirty && error?.message}
            type="search"
            placeholder="I'm looking for..."
            fullWidth
            variant="outlined"
            margin="normal"
            onSubmit={handleSubmit(onSubmit)}
          />
        )}
      />
    </Box>
  );
};

export default SearchDatasets;
