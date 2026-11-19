"use client";
import { Typography } from "@mui/material";
import ActionMenuSection from "@/components/ActionMenuSection";

const UsersGuidance = () => {
  return (
    <ActionMenuSection title="Users" fixedExpanded scrollable>
      <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 1 }}>
        Select a user from the list to see their details, linked sign-in
        providers, roles and workgroups.
      </Typography>
    </ActionMenuSection>
  );
};

export default UsersGuidance;
