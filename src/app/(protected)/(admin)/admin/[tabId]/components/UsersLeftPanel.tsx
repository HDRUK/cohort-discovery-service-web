"use client";
import { Box, Typography } from "@mui/material";
import ActionMenuSection from "@/components/ActionMenuSection";

const UsersLeftPanel = () => {
  return (
    <Box
      sx={{
        px: 1,
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
      }}
    >
      <ActionMenuSection title={"Users"} defaultExpanded underline>
        <Typography variant="body2" color="text.secondary">
          Browse all platform users. Select a user from the list to view
          their roles and workgroups.
        </Typography>
      </ActionMenuSection>
    </Box>
  );
};

export default UsersLeftPanel;
