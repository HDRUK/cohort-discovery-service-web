"use client";

import { useForm, Controller } from "react-hook-form";
import { Box, Button, TextField } from "@mui/material";
import useQueryBuilder from "@/store/useQueryBuilder";
import { useEffect } from "react";
import Title from "@/components/Title";
import { useNotify } from "../../providers/NotifyProvider";

type FormValues = {
  queryName: string;
};

const CohortQueryTitle = () => {
  const { queryName, setQueryName } = useQueryBuilder((qb) => ({
    queryName: qb.queryName,
    setQueryName: qb.setQueryName,
  }));
  const notify = useNotify();

  const { handleSubmit, control, setValue } = useForm<FormValues>({
    defaultValues: {
      queryName: "",
    },
  });

  useEffect(() => {
    return () => {
      setQueryName("");
      setValue("queryName", "");
    };
  }, [setQueryName, setValue]);

  useEffect(() => {
    setValue("queryName", queryName);
  }, [queryName, setValue]);

  const onSubmit = (data: FormValues) => {
    setQueryName(data.queryName);
    notify.success("Query name saved");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        width: "95%",
        my: 2,
      }}
    >
      <Title title={"Search Query"} subTitle="Name">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Controller
            name="queryName"
            control={control}
            defaultValue=""
            rules={{ required: "A name for your query is required" }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                error={!!error}
                placeholder={error ? error.message : "Enter query name"}
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  },
                }}
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            color="tertiary"
            data-shape="curvedRight"
          >
            Save
          </Button>
        </Box>
      </Title>
    </Box>
  );
};

export default CohortQueryTitle;
