import { Suspense } from "react";
import { Box, Divider } from "@mui/material";
import { getAdminCollections } from "@/server/data/collections";
import SkeletonFull from "@/components/SkeletonFull";
import Title from "@/components/Title";
import CollectionHealthDetailView from "@/modules/CollectionHealth/CollectionHealthDetailView";
import { requestTime } from "@/server/requestTime";

const loadCollection = async (pid: string) => {
  const result = await getAdminCollections({
    params: new URLSearchParams({ pid }),
  });

  return {
    collections: result.data?.data ?? [],
    fetchedAt: await requestTime(),
  };
};

const CollectionHealthLoader = async ({
  params,
}: {
  params: Promise<{ pid: string }>;
}) => {
  const { pid } = await params;
  const { collections, fetchedAt } = await loadCollection(pid);

  return (
    <CollectionHealthDetailView
      pid={pid}
      initialCollections={collections}
      fetchedAt={fetchedAt}
    />
  );
};

const AdminCollectionHealthDetailPage = ({
  params,
}: {
  params: Promise<{ pid: string }>;
}) => {
  return (
    <Box
      sx={{
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        p: 2,
        bgcolor: "background.default",
      }}
    >
      <Title title="Admin" subTitle="Collection Health" />
      <Divider sx={{ mb: 2 }} />
      <Suspense fallback={<SkeletonFull sx={{ minHeight: 400 }} />}>
        <CollectionHealthLoader params={params} />
      </Suspense>
    </Box>
  );
};

export default AdminCollectionHealthDetailPage;
