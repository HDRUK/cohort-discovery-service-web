"use client";

import { useEffect } from "react";
import {
  CollectionsSearchParams,
  CollectionWithHosts,
  Paginated,
} from "@/types/api";
import { Box, Skeleton } from "@mui/material";
import Title from "@/components/Title";
import ThreePaneSwimLaneLayout from "@/modules/ThreePaneSwimLaneLayout";
import CollectionsTable from "@/components/CollectionsTable";
import ControlledSearchBox from "@/modules/ControlledSearchBox";
import CollectionsLeftPanel from "@/modules/CollectionsLeftPanel";
import CollectionsRightPanel from "@/modules/CollectionsRightPanel";
import useCustodianStore from "@/hooks/useCustodianStore";
import useAdminStore from "@/hooks/useAdminStore";
import { ThreePaneProvider } from "@/providers/ThreePaneProvider";

type Props = {
  isAdmin: boolean;
  collections: Paginated<CollectionWithHosts>;
};

const CollectionsManagement = ({ isAdmin, collections }: Props) => {
  const custodian = useCustodianStore(
    (custodianData) => custodianData.current.custodian,
  );

  const setAdminCollections = useAdminStore((s) => s.setCollections);
  const setCustodianCollections = useCustodianStore(
    (s) => s.current.setCollections,
  );

  useEffect(() => {
    if (isAdmin) setAdminCollections(collections);
    else setCustodianCollections(collections);
  }, [isAdmin, collections, setAdminCollections, setCustodianCollections]);

  if (!isAdmin && !custodian) return <Skeleton height={"100%"} />;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        height: "100%",
      }}
    >
      <Title title="Collections" subTitle="Management" />
      <ControlledSearchBox<CollectionsSearchParams>
        paramName="search_term"
        placeholder="Search by collection name..."
      />
      <ThreePaneProvider>
        <ThreePaneSwimLaneLayout
          rightDisabled={false}
          left={<CollectionsLeftPanel />}
          middle={<CollectionsTable />}
          right={<CollectionsRightPanel />}
        />
      </ThreePaneProvider>
    </Box>
  );
};

export default CollectionsManagement;
