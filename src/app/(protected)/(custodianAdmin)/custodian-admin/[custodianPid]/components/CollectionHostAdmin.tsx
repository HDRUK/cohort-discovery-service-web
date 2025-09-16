"use client";
import CreateCollectionHost from "@/modules/CreateCollectionHost";
import { useDaphneStore } from "@/store/useDaphneStore";
import { CollectionHost } from "@/types/api";
import { Box, Skeleton } from "@mui/material";
import CollectionHostsTable from "./CollectionHostsTable";

const CollectionHostAdmin = ({
  pid,
  collectionHosts,
}: {
  pid: string;
  collectionHosts: CollectionHost[];
}) => {
  const {
    custodianData: { custodians },
  } = useDaphneStore();

  const custodian = custodians.find((c) => c.pid === pid);
  if (!custodian) return <Skeleton height={"100%"} />;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box>
        <CreateCollectionHost custodian={custodian} />
      </Box>
      <Box>
        <CollectionHostsTable collectionHosts={collectionHosts} />
      </Box>
    </Box>
  );
};

export default CollectionHostAdmin;
