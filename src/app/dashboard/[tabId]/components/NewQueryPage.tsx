"use server";

import { Box, Paper } from "@mui/material";

import QueryBuilder from "@/components/QueryBuilder";
import SubmitQueryButton from "@/components/SubmitQueryButton";
import CohortQueryInput from "@/components/CohortQueryInput";

const NewQueryPage = async () => {
  return (
    <>
      <CohortQueryInput />
      <Paper
        sx={{
          p: 2,
          borderStyle: "solid",
          borderColor: "primary.main",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <QueryBuilder />
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            width: "100%",
            my: 2,
          }}
        >
          <SubmitQueryButton />
        </Box>
      </Paper>
    </>
  );
};

export default NewQueryPage;
