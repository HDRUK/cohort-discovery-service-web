"use client";

import { Paper } from "@mui/material";
import TabsShell from "@/components/TabsShell";
import OverviewTab from "./OverviewTab";
import Title from "@/components/Title";
import TutorialTab, { VideoLibrarySection } from "./TutorialTab";

// TODO: actual content
const VIDEOS: Record<number, VideoLibrarySection> = {
  1: {
    sectionTitle: "Query Building Tutorials",
    videos: [
      {
        id: "rename-query",
        title: "How do I rename my query?",
        url: "https://www.youtube.com/embed/yvFrnbXlqRk?feature=oembed",
        thumbnail: "https://img.youtube.com/vi/yvFrnbXlqRk/hqdefault.jpg",
        categorisation: "Beginner",
      },
      {
        id: "reorder-rules",
        title: "How do I re-order rules?",
        text: "Click the box to the right of the query name, type your new name, and press Enter to save. To rename it again, hover over the name, double-click, edit, and press Enter.",
        url: "https://www.youtube.com/embed/RNVqqCpgeZk?feature=oembed",
        thumbnail: "https://img.youtube.com/vi/RNVqqCpgeZk/hqdefault.jpg",
        categorisation: "Beginner",
      },
    ],
  },
  2: {
    sectionTitle: "Results Tutorials",
    videos: [
      {
        id: "reorder-rules2",
        title: "How do I re-order rules?",
        text: "Click the box to the right of the query name, type your new name, and press Enter to save. To rename it again, hover over the name, double-click, edit, and press Enter.",
        url: "https://www.youtube.com/embed/RNVqqCpgeZk?feature=oembed",
        thumbnail: "https://img.youtube.com/vi/RNVqqCpgeZk/hqdefault.jpg",
        categorisation: "Beginner",
      },
      {
        id: "rename-query2",
        title: "How do I rename my query?",
        url: "https://www.youtube.com/embed/yvFrnbXlqRk?feature=oembed",
        thumbnail: "https://img.youtube.com/vi/yvFrnbXlqRk/hqdefault.jpg",
        categorisation: "Beginner",
      },
    ],
  },
};

const Help = () => {
  return (
    <>
      <Title
        title="General Guidance"
        useSeparator
        subTitle="Query Building Tutorials"
      />{" "}
      {/* Title is fixed, or follows subtab label? */}
      <Paper sx={{ bgcolor: "white", py: 2, height: "100%" }}>
        <TabsShell
          tabs={[
            {
              label: "Overview Tutorials",
              page: <OverviewTab />,
            },
            ...Object.entries(VIDEOS).map((category) => {
              //TODO: potentially rehash this VIDEOS object type as it's a bit unwieldy to do this
              return {
                label: category[1].sectionTitle,
                page: (
                  <TutorialTab
                    label={category[1].sectionTitle}
                    videoLibrarySection={category[1]}
                  />
                ),
              };
            }),
          ]}
          sx={{
            backgroundColor: "white",
          }}
          tabListSx={(theme) => ({
            px: 2,
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
