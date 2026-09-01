import { Box, Divider } from "@mui/material";
import getAdminCollections from "@/actions/collection/getAdminCollections";
import Title from "@/components/Title";
import CollectionHealth from "@/modules/CollectionHealth/CollectionHealth";

const AdminCollectionHealthPage = async () => {
  const result = await getAdminCollections({
    params: new URLSearchParams({ per_page: "500" }),
  });

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
      <CollectionHealth initialCollections={result.data?.data ?? []} />
    </Box>
  );
};

export default AdminCollectionHealthPage;
