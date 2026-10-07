import { Suspense } from "react";
import { Box, Divider } from "@mui/material";
import getAdminCollections from "@/actions/collection/getAdminCollections";
import SkeletonFull from "@/components/SkeletonFull";
import Title from "@/components/Title";
import CollectionHealth from "@/modules/CollectionHealth/CollectionHealth";

const loadCollections = async () => {
  const result = await getAdminCollections({
    params: new URLSearchParams({ per_page: "500" }),
  });

  return { collections: result.data?.data ?? [], fetchedAt: Date.now() };
};

const CollectionHealthLoader = async () => {
  const { collections, fetchedAt } = await loadCollections();

  return (
    <CollectionHealth initialCollections={collections} fetchedAt={fetchedAt} />
  );
};

const AdminCollectionHealthPage = () => (
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
    <Title title="Admin" subTitle="Collection Health" />
    <Divider sx={{ mb: 2 }} />
    <Suspense fallback={<SkeletonFull sx={{ minHeight: 0 }} />}>
      <CollectionHealthLoader />
    </Suspense>
  </Box>
);

export default AdminCollectionHealthPage;
