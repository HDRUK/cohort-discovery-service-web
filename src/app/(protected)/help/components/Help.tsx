"use client";

import { Paper } from "@mui/material";
import TabsShell from "@/components/TabsShell";
import OverviewTab from "./OverviewTab";
import Title from "@/components/Title";

const Help = () => {
  return (
    <>
      <Title
        title="General Guidance"
        useSeparator
        subTitle="Query Building Tutorials"
      />{" "}
      {/* Title is fixed, or follows subtab label? */}
      <Paper sx={{ bgcolor: "white", p: 2, height: "100%" }}>
        <TabsShell
          tabs={[
            {
              label: "Overview Tutorials",
              page: <OverviewTab />,
            },
            {
              label: "Query Building Tutorials",
              page: <OverviewTab />,
            },
          ]}
          sx={{
            backgroundColor: "white",
          }}
          tabListSx={(theme) => ({
            "& .Mui-selected": {
              bgcolor: "white !important",
            },
            "& .MuiTabs-indicator": {
              top: 40,
              bottom: 0,
              bgcolor: theme.palette.secondary.main,
              opacity: 1,
              borderRadius: 0,
              height: "2px",
              paddingBottom: "2px",
            },
          })}
        />
      </Paper>
    </>
  );
};

export default Help;
