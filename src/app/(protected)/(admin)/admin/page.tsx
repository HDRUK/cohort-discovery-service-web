import Adm_UserList from "@/components/Adm_UserList/Adm_UserList";
import { Paper } from "@mui/material";

const AdminHomePage = () => {
  return (
    <Paper sx={{ width: "100%", height: "100%" }}>
      <Adm_UserList />
    </Paper>
  );
};

export default AdminHomePage;
