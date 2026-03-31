import { Box } from "@mui/material";
import { FeatureFlagManager } from "./components/FeatureFlagManager";
import Title from "@/components/Title";

const FeatureFlagPage = async () => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        p: 2,
        bgcolor: "background.default",
      }}
    >
      <Title title="Admin" subTitle="Feature Flags" />
      <Box
        sx={{
          maxWidth: 1000,
          display: "flex",
          alignItems: "center",
          mx: "auto",
        }}
      >
        <FeatureFlagManager />
      </Box>
    </Box>
  );
};

export default FeatureFlagPage;
