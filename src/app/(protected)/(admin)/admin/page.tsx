import AdminUserList from "../components/AdminUserList";
import { Paper } from "@mui/material";
import getSearchUsers from "@/actions/admin/getSearchUsers";

interface PageProps {
  searchParams: Promise<{
    searchTerm?: string;
  }>;
}

const AdminHomePage = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const users = await getSearchUsers(params?.searchTerm);

  return (
    <Paper sx={{ width: "100%", height: "100%" }}>
      <AdminUserList users={users.data} />
    </Paper>
  );
};

export default AdminHomePage;
