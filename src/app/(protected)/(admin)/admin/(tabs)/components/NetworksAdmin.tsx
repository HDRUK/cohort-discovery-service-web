"use client";
import {
  Custodian,
  Network,
  NetworkCustodiansSearchParams,
  Paginated,
} from "@/types/api";
import { Box } from "@mui/material";
import Title from "@/components/Title";
import ThreePaneSwimLaneLayout from "@/modules/ThreePaneSwimLaneLayout";
import ControlledSearchBox from "@/modules/ControlledSearchBox";
import { NetworksProvider } from "@/contexts/NetworksContext";
import NetworksLeftPanel from "./NetworksLeftPanel";
import NetworksMiddlePanel from "./NetworksMiddlePanel";
import NetworksRightPanel from "./NetworksRightPanel";
import { ThreePaneProvider } from "@/providers/ThreePaneProvider";

const NO_NETWORKS: Network[] = [];

const NetworksAdmin = ({
  networks,
  custodians,
}: {
  networks?: Network[];
  custodians?: Paginated<Custodian>;
}) => {
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}
    >
      <Title title="Networks" subTitle="Management" />
      <ControlledSearchBox<NetworkCustodiansSearchParams>
        paramName="search_term"
        placeholder="Search custodians by name..."
        submitOnChange
      />
      <NetworksProvider networks={networks ?? NO_NETWORKS}>
        <ThreePaneProvider>
          <ThreePaneSwimLaneLayout
            rightDisabled={false}
            left={<NetworksLeftPanel />}
            middle={
              <NetworksMiddlePanel
                custodians={custodians}
                isLoading={networks === undefined}
              />
            }
            right={<NetworksRightPanel />}
          />
        </ThreePaneProvider>
      </NetworksProvider>
    </Box>
  );
};

export default NetworksAdmin;
