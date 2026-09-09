import { Suspense } from "react";
import { Box, Divider } from "@mui/material";
import getAdminCollections from "@/actions/collection/getAdminCollections";
import SkeletonFull from "@/components/SkeletonFull";
import Title from "@/components/Title";
import AggregateTelemetryView from "@/modules/CollectionHealth/AggregateTelemetryView";
import CollectionHealthTabs, {
  COLLECTION_HEALTH_TABS,
} from "@/modules/CollectionHealth/CollectionHealthTabs";
import { COLLECTIONS_PER_PAGE } from "@/modules/CollectionHealth/useCollectionHealth";

const loadCollections = async () => {
  const result = await getAdminCollections({
    params: new URLSearchParams({ per_page: COLLECTIONS_PER_PAGE }),
  });

  return { collections: result.data?.data ?? [], fetchedAt: Date.now() };
};

const AggregateTelemetryLoader = async () => {
  const { collections, fetchedAt } = await loadCollections();

  return (
    <AggregateTelemetryView
      initialCollections={collections}
      fetchedAt={fetchedAt}
    />
  );
};

const AdminCollectionTelemetryPage = () => (
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
    <CollectionHealthTabs value={COLLECTION_HEALTH_TABS.telemetry} />
    <Suspense fallback={<SkeletonFull sx={{ minHeight: 400 }} />}>
      <AggregateTelemetryLoader />
    </Suspense>
  </Box>
);

export default AdminCollectionTelemetryPage;
