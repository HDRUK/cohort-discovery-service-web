"use client";
import { Network } from "@/types/api";
import { Box, Skeleton } from "@mui/material";
import Title from "@/components/Title";
import ThreePaneSwimLaneLayout, {
  ExpandedSide,
} from "@/modules/ThreePaneSwimLaneLayout";
import { useEffect, useState } from "react";
import { useAdminDataStore } from "@/store/adminDataStore";
import NetworksLeftPanel from "./NetworksLeftPanel";
import NetworksMiddlePanel from "./NetworksMiddlePanel";
import NetworksRightPanel from "./NetworksRightPanel";

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

  const toggleExpandRight = () => {
    setExpandedSide((prev) =>
      prev === ExpandedSide.RIGHT ? null : ExpandedSide.RIGHT,
    );
  };

  if (!networks) return <Skeleton height={"100%"} />;

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}
    >
      <Title title="Networks" subTitle="Management" />
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
        right={
          <NetworksRightPanel
            expandedRight={expandedRight}
            onClose={() => toggleExpandRight()}
          />
        }
      />
    </Box>
  );
};

export default NetworksAdmin;
