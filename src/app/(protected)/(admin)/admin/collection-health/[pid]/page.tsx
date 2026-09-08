import { Suspense } from "react";
import { Box, Divider } from "@mui/material";
import getAdminCollections from "@/actions/collection/getAdminCollections";
import SkeletonFull from "@/components/SkeletonFull";
import Title from "@/components/Title";
import CollectionHealthDetailView from "@/modules/CollectionHealth/CollectionHealthDetailView";

const loadCollection = async (pid: string) => {
  const result = await getAdminCollections({
    params: new URLSearchParams({ pid }),
    cacheOptions: { useCache: false },
  });

  return { collections: result.data?.data ?? [], fetchedAt: Date.now() };
};

const CollectionHealthLoader = async ({ pid }: { pid: string }) => {
  const { collections, fetchedAt } = await loadCollection(pid);

  return (
    <CollectionHealthDetailView
      pid={pid}
      initialCollections={collections}
      fetchedAt={fetchedAt}
    />
  );
};

const AdminCollectionHealthDetailPage = async ({
  params,
}: {
  params: Promise<{ pid: string }>;
}) => {
  const { pid } = await params;

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
      <Title title="Admin" subTitle="Collection Health" />
      <Divider sx={{ mb: 2 }} />
      <Suspense fallback={<SkeletonFull sx={{ minHeight: 400 }} />}>
        <CollectionHealthLoader pid={pid} />
      </Suspense>
    </Box>
  );
};

export default AdminCollectionHealthDetailPage;
