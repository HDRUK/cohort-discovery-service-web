import { Box, Typography, Paper } from "@mui/material";
import QueryBuilder from "../components/QueryBuilder";
import sendQuery from "../methods/sendQuery";
import getMyQueryAction from "../actions/getMyQueryAction";

const DashboardPage = () => {
  sendQuery("dasdas");
  getMyQueryAction("dasaihaaao");

  return (
    <Box sx={{ width: "50%" }}>
      <Paper>
        <QueryBuilder />
      </Paper>

      {/*<Typography>{formatQuery(query, "json")}</Typography>*/}
    </Box>
  );
};

export default DashboardPage;
