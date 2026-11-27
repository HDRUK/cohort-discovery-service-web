"use client";
import { Box } from "@mui/material";
import Title from "@/components/Title";
import ThreePaneSwimLaneLayout from "@/modules/ThreePaneSwimLaneLayout";
import { ThreePaneProvider } from "@/providers/ThreePaneProvider";
import ConfigurationLeftPanel from "./ConfigurationLeftPanel";
import ConfigurationMiddlePanel from "./ConfigurationMiddlePanel";

const ConfigurationAdmin = () => (
  <Box
    sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}
  >
    <Title title="Configuration" subTitle="Management" />
    <ThreePaneProvider>
      <ThreePaneSwimLaneLayout
        rightDisabled
        left={<ConfigurationLeftPanel />}
        middle={<ConfigurationMiddlePanel />}
        right={null}
      />
    </ThreePaneProvider>
  </Box>
);

export default ConfigurationAdmin;
