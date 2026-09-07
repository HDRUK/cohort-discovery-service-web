import { Box, Divider } from "@mui/material";
import getAdminCollections from "@/actions/collection/getAdminCollections";
import Title from "@/components/Title";
import CollectionHealthDetailView from "@/modules/CollectionHealth/CollectionHealthDetailView";

const loadCollections = async () => {
  const result = await getAdminCollections({
    params: new URLSearchParams({ per_page: "500" }),
    cacheOptions: { useCache: false },
  });

  return { collections: result.data?.data ?? [], fetchedAt: Date.now() };
};

const AdminCollectionHealthDetailPage = async ({
  params,
}: {
  params: Promise<{ pid: string }>;
}) => {
  const { pid } = await params;
  const { collections, fetchedAt } = await loadCollections();
  const collection = collections.find((candidate) => candidate.pid === pid);

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
      <Title
        title="Collection Health"
        subTitle={collection?.name ?? "Unknown collection"}
      />
      <Divider sx={{ mb: 2 }} />
      <CollectionHealthDetailView
        pid={pid}
        initialCollections={collections}
        fetchedAt={fetchedAt}
      />
    </Box>
  );
};

export default AdminCollectionHealthDetailPage;
