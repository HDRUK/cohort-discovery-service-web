import { Suspense } from "react";
import { Box, Divider } from "@mui/material";
import Title from "@/components/Title";
import TableSkeleton from "@/components/TableSkeleton";
import getAdminCollections from "@/actions/collection/getAdminCollections";
import RegressionTests from "@/modules/RegressionTests/RegressionTests";

const RegressionContent = async () => {
  const result = await getAdminCollections({
    params: new URLSearchParams({ per_page: "500" }),
  });
  const collections = result.data?.data ?? [];

  return <RegressionTests collections={collections} />;
};

const AdminRegressionPage = () => {
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
      <Suspense fallback={<TableSkeleton />}>
        <RegressionContent />
      </Suspense>
    </Box>
  );
};

export default AdminRegressionPage;
