"use client";
import {
  CollectionsSearchParams,
  CollectionWithHosts,
  Network,
  Paginated,
} from "@/types/api";
import { Box, Skeleton } from "@mui/material";
import Title from "@/components/Title";
import ThreePaneSwimLaneLayout, {
  ExpandedSide,
} from "@/modules/ThreePaneSwimLaneLayout";
import { useEffect, useState } from "react";
import ControlledSearchBox from "@/modules/ControlledSearchBox";
import WorkgroupsLeftPanel from "./WorkgroupsLeftPanel";
import WorkgroupsMiddlePanel from "./WorkgroupsMiddlePanel";
import WorkgroupsRightPanel from "./WorkgroupsRightPanel";
import { useAdminDataStore } from "@/store/adminDataStore";
import NetworksLeftPanel from "./NetworksLeftPanel";
import NetworksMiddlePanel from "./NetworksMiddlePanel";

const NetworksAdmin = ({ networks }: { networks: Network[] }) => {
  const setNetworks = useAdminDataStore((s) => s.setNetworks);
  useEffect(() => {
    setNetworks(networks);
  }, [networks, setNetworks]);

  const [expandedSide, setExpandedSide] = useState<ExpandedSide | null>(null);
  const expandedLeft = expandedSide === ExpandedSide.LEFT;
  const expandedRight = expandedSide === ExpandedSide.RIGHT;

  const toggleExpandLeft = () => {
    setExpandedSide((prev) =>
      prev === ExpandedSide.LEFT ? null : ExpandedSide.LEFT,
    );
  };

  // needs a url

  const toggleExpandRight = () => {
    setExpandedSide((prev) =>
      prev === ExpandedSide.RIGHT ? null : ExpandedSide.RIGHT,
    );
  };

  if (!networks) return <Skeleton height={"100%"} />;

  {
    /**/
  }

  {
    /*<WorkgroupsRightPanel
            expandedRight={expandedRight}
            onClose={() => toggleExpandRight()}
          />*/
  }
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}
    >
      <Title title="Networks" subTitle="Management" />
      {/*<ControlledSearchBox<CollectionsSearchParams>
        paramName="search_term"
        placeholder="Search by collection name or username..."
      />*/}
      <ThreePaneSwimLaneLayout
        expandedSide={expandedSide}
        rightDisabled={false}
        left={
          <NetworksLeftPanel
            expandedLeft={expandedLeft}
            onCreate={toggleExpandLeft}
            onCancelCreate={toggleExpandLeft}
          />
        }
        middle={<NetworksMiddlePanel />}
        right={<b> hi</b>}
      />
    </Box>
  );
};

export default NetworksAdmin;
