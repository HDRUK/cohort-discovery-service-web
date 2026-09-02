import { Box, Divider } from "@mui/material";
import getAdminCollections from "@/actions/collection/getAdminCollections";
import Title from "@/components/Title";
import CollectionHealth from "@/modules/CollectionHealth/CollectionHealth";

// Stamped alongside the fetch, not during render, so the client measures ping
// ages from when the data was actually read rather than from hydration.
const loadCollections = async () => {
  const result = await getAdminCollections({
    params: new URLSearchParams({ per_page: "500" }),
  });

  return { collections: result.data?.data ?? [], fetchedAt: Date.now() };
};

const AdminCollectionHealthPage = async () => {
  const { collections, fetchedAt } = await loadCollections();

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        p: 2,
        bgcolor: "background.default",
      }}>
      <Title title="Admin" subTitle="Collection Health" />
      <Divider sx={{ mb: 2 }} />
      <CollectionHealth
        initialCollections={collections}
        fetchedAt={fetchedAt}
      />
    </Box>
  );
};

export default AdminCollectionHealthPage;
