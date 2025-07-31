import { Box, Paper } from "@mui/material";
import QueryBuilder from "../components/QueryBuilder";
import SubmitQueryButton from "../components/SubmitQueryButton";
import CohortQueryInput from "../components/CohortQueryInput";
import QueryList from "../components/QueryList";

const DashboardPage = () => {
  return (
    <Box
      sx={{
        width: "100%",
        //height: "100vh", // overflows y direction
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <CohortQueryInput />
      <Paper
        sx={{
          width: "50%",
          p: 2,
          borderStyle: "solid",
          borderColor: "primary.main",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <QueryBuilder />
        <Box
          sx={{ display: "flex", justifyContent: "end", width: "100%", my: 2 }}
        >
          <SubmitQueryButton />
        </Box>
      </Paper>
      <Box sx={{ height: 400, width: "100%" }}>
        <QueryList />
      </Box>
    </Box>
  );
};

export default DashboardPage;
