// "use client";

// import { useMemo } from "react";
// import { Paper } from "@mui/material";
// import { usePathname } from "next/navigation";
// import { routes } from "@/config/routes";
// import TabsShell from "@/components/TabsShell";
// import { TabType } from "@/components/TabsShell/TabsShell";
// import OverviewTab from "./OverviewTab";
// import Title from "@/components/Title";
// import TutorialTab, { VideoLibrarySection } from "./TutorialTab";

// // TODO: actual content
// export const VIDEOS: Record<number, VideoLibrarySection> = {
//   1: {
//     sectionTitle: "Query Building Tutorials",
//     videos: [
//       {
//         id: "rename-query",
//         title: "How do I rename my query?",
//         url: "https://www.youtube.com/embed/yvFrnbXlqRk?feature=oembed",
//         thumbnail: "https://img.youtube.com/vi/yvFrnbXlqRk/hqdefault.jpg",
//         categorisation: "Beginner",
//         href: routes.help("Query Building Tutorials", "rename-query"),
//       },
//       {
//         id: "reorder-rules",
//         title: "How do I re-order rules?",
//         text: "Click the box to the right of the query name, type your new name, and press Enter to save. To rename it again, hover over the name, double-click, edit, and press Enter.",
//         url: "https://www.youtube.com/embed/RNVqqCpgeZk?feature=oembed",
//         thumbnail: "https://img.youtube.com/vi/RNVqqCpgeZk/hqdefault.jpg",
//         categorisation: "Beginner",
//         href: routes.help("Query Building Tutorials", "reorder-rules"),
//       },
//     ],
//   },
//   2: {
//     sectionTitle: "Results Tutorials",
//     videos: [
//       {
//         id: "reorder-rules2",
//         title: "How do I re-order rules?",
//         text: "Click the box to the right of the query name, type your new name, and press Enter to save. To rename it again, hover over the name, double-click, edit, and press Enter.",
//         url: "https://www.youtube.com/embed/RNVqqCpgeZk?feature=oembed",
//         thumbnail: "https://img.youtube.com/vi/RNVqqCpgeZk/hqdefault.jpg",
//         categorisation: "Beginner",
//         href: routes.help("Results Tutorials", "reorder-rules2"),
//       },
//       {
//         id: "rename-query2",
//         title: "How do I rename my query?",
//         url: "https://www.youtube.com/embed/yvFrnbXlqRk?feature=oembed",
//         thumbnail: "https://img.youtube.com/vi/yvFrnbXlqRk/hqdefault.jpg",
//         categorisation: "Beginner",
//         href: routes.help("Results Tutorials", "rename-query2"),
//       },
//     ],
//   },
// };

// const Help = () => {
//   const pathname = usePathname();

//   const tabs = useMemo<TabType[]>(() => {
//     const tabs = [
//       {
//         label: "Overview Tutorials",
//         page: <OverviewTab />,
//         href: routes.help("overview"),
//       },
//       ...Object.entries(VIDEOS).map((category) => {
//         //TODO: potentially rehash this VIDEOS object type as it's a bit unwieldy to do this
//         return {
//           label: category[1].sectionTitle,
//           page: (
//             <TutorialTab
//               label={category[1].sectionTitle}
//               videoLibrarySection={category[1]}
//             />
//           ),
//           href: routes.help(category[1].sectionTitle),
//         };
//       }),
//     ];

//     return tabs;
//   }, [routes, VIDEOS]);

//   const currentTabValue =
//     tabs.find((tab) => {
//       const matchPath = tab?.route ?? tab.href;
//       if (!matchPath) return false;

//       return pathname === matchPath || pathname.startsWith(matchPath + "/");
//     })?.id ??
//     tabs[0]?.id ??
//     0;

//   return (
//     <>
//       <Title
//         title="General Guidance"
//         useSeparator
//         subTitle="Query Building Tutorials"
//       />
//       {/* Title is fixed, or follows subtab label? */}
//       <Paper sx={{ bgcolor: "white", py: 2, height: "100%" }}>
//         <TabsShell
//           tabs={tabs}
//           value={currentTabValue}
//           sx={{
//             backgroundColor: "white",
//           }}
//           tabListSx={(theme) => ({
//             px: 2,
//             "& .Mui-selected": {
//               bgcolor: "white !important",
//             },
//             "& .MuiTabs-indicator": {
//               top: 40,
//               bottom: 0,
//               bgcolor: theme.palette.secondary.main,
//               opacity: 1,
//               borderRadius: 0,
//               height: "2px",
//               paddingBottom: "2px",
//             },
//           })}
//         />
//       </Paper>
//     </>
//   );
// };

// export default Help;
