"use client";
import { Network } from "@/types/api";
import { Box, Skeleton } from "@mui/material";
import Title from "@/components/Title";
import ThreePaneSwimLaneLayout from "@/modules/ThreePaneSwimLaneLayout";
import { NetworksProvider } from "@/contexts/NetworksContext";
import NetworksLeftPanel from "./NetworksLeftPanel";
import NetworksMiddlePanel from "./NetworksMiddlePanel";
import NetworksRightPanel from "./NetworksRightPanel";
import { ThreePaneProvider } from "@/providers/ThreePaneProvider";

const NetworksAdmin = ({ networks }: { networks: Network[] }) => {
  if (!networks) return <Skeleton height={"100%"} />;

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}
    >
      <Title title="Networks" subTitle="Management" />
      <NetworksProvider networks={networks}>
        <ThreePaneProvider>
          <ThreePaneSwimLaneLayout
            rightDisabled={false}
            left={<NetworksLeftPanel />}
            middle={<NetworksMiddlePanel />}
            right={<NetworksRightPanel />}
          />
        </ThreePaneProvider>
      </NetworksProvider>
    </Box>
  );
};

export default NetworksAdmin;
