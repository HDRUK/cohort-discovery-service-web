"use client";

import { Box } from "@mui/material";
import UserTable from "@/components/UserTable";

const UsersMiddlePanel = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
      }}
    >
      <UserTable
        tableTitle="Users"
        tableSubTitle="All"
        showRolesAndWorkgroupColumns
        showCheckboxes={false}
        emptyMessage="Users will appear here when they are added to the platform"
      />
    </Box>
  );
};

export default UsersMiddlePanel;
