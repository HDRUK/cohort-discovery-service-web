"use client";

import { CollectionsSearchParams } from "@/types/api";
import { Box, Skeleton } from "@mui/material";
import Title from "@/components/Title";
import ThreePaneSwimLaneLayout from "@/modules/ThreePaneSwimLaneLayout";
import CollectionsTable from "@/components/CollectionsTable";
import ControlledSearchBox from "@/modules/ControlledSearchBox";
import CollectionsLeftPanel from "@/modules/CollectionsLeftPanel";
import CollectionsRightPanel from "@/modules/CollectionsRightPanel";
import { ThreePaneProvider } from "@/providers/ThreePaneProvider";
import { useCustodianSection } from "@/contexts/CustodianSectionContext";

type Props = {
  isAdmin: boolean;
};

const CollectionsManagement = ({ isAdmin }: Props) => {
  const custodian = useCustodianSection()?.custodian;

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
        submitOnChange
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
