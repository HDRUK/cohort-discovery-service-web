"use client";
import { Box } from "@mui/material";
import Title from "@/components/Title";
import ThreePaneSwimLaneLayout from "@/modules/ThreePaneSwimLaneLayout";
import ControlledSearchBox from "@/modules/ControlledSearchBox";
import UsersLeftPanel from "./UsersLeftPanel";
import UsersMiddlePanel from "./UsersMiddlePanel";
import UsersRightPanel from "./UsersRightPanel";
import { ThreePaneProvider } from "@/providers/ThreePaneProvider";

const UsersAdmin = () => {
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}
    >
      <Title title="Users" subTitle="Management" />
      <ControlledSearchBox
        paramName="search_term"
        placeholder="Search by name or email..."
        submitOnChange
      />
      <ThreePaneProvider>
        <ThreePaneSwimLaneLayout
          rightDisabled={false}
          left={<UsersLeftPanel />}
          middle={<UsersMiddlePanel />}
          right={<UsersRightPanel />}
        />
      </ThreePaneProvider>
    </Box>
  );
};

export default UsersAdmin;
