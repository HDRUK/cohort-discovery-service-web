import { Box, Divider } from "@mui/material";
import Title from "@/components/Title";
import getAdminCollections from "@/actions/collection/getAdminCollections";
import RegressionTests from "@/modules/RegressionTests/RegressionTests";

const AdminRegressionPage = async () => {
  const result = await getAdminCollections({
    params: new URLSearchParams({ per_page: "500" }),
  });
  const collections = result.data?.data ?? [];

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        p: 2,
        bgcolor: "background.default",
      }}
    >
      <Title title="Admin" subTitle="Regression Tests" />
      <Divider sx={{ mb: 2 }} />
      <RegressionTests collections={collections} />
    </Box>
  );
};

export default AdminRegressionPage;
