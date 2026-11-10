import { Box, Divider, Stack } from "@mui/material";
import { FeatureFlagManager } from "./components/FeatureFlagManager";
import Title from "@/components/Title";
import { DefaultsManager } from "./components/DefaultsManager";

const AdminConfigurationPage = async () => {
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
      <Title title="Admin" subTitle="Configuration" />
      <Divider />
      <Stack direction="row">
        <FeatureFlagManager />
        <DefaultsManager />
      </Stack>
    </Box>
  );
};

export default AdminConfigurationPage;
