"use client";
import CreateCollection from "@/modules/CreateCollection";
import { useDaphneStore } from "@/store/useDaphneStore";
import { CollectionWithHosts, CollectionHost, Paginated } from "@/types/api";
import { Box, Skeleton } from "@mui/material";
import CollectionTable from "./CollectionTable";

const CollectionAdmin = ({
  pid,
  collections,
  collectionHosts,
}: {
  pid: string;
  collections: Paginated<CollectionWithHosts[]>;
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
        <CreateCollection
          custodian={custodian}
          collectionHosts={collectionHosts}
        />
      </Box>
      <CollectionTable collections={collections} />
    </Box>
  );
};

export default CollectionAdmin;
