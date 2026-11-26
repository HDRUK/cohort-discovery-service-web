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
          Everyone with an account on this deployment, newest first. Search by
          name or email to narrow the list.
        </Typography>
      </ActionMenuSection>
    </Box>
  );
};

export default UsersLeftPanel;
