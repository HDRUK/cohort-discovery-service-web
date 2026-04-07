"use client";

import { use } from "react";

// import NewQueryPage from "./components/NewQueryPage";
// import QueryResultsPage from "./components/QueryResultsPage";
// import { routes } from "@/config/routes";
// import TabsShell from "@/components/TabsShell";
// import { ACCESS_TOKEN_NAME } from "@/config/internals";
// import { cookies } from "next/headers";
// import getQuery from "@/actions/query/getQuery";
// import { capVarChar } from "@/utils/string";
// import { SearchParams } from "@/types/api";
// import QueryHistoryPage from "./components/QueryHistoryPage";
// import { getQueryName } from "@/utils/query";

// type Params = Promise<{ tutorialId: string }>;
import TutorialPage from "../../components/TutorialPage";

const TutorialOuterPage = ({
  params,
}: {
  params: Promise<{ tutorialId: string }>;
}) => {
  const { tutorialId } = use(params);

  console.log(tutorialId);
  //   const { params, searchParams } = props;
  //   const { tabId } = await params;
  //   const { query, open_queries: openQueries } = await searchParams;
  //   const arrayOpenQueries = ((openQueries as string) ?? "").split(",");

  return TutorialPage({ tutorialId: tutorialId });
  // <Paper
  //   sx={{
  //     backgroundColor: "white",
  //     border: 1,
  //     borderWidth: "0.5px",
  //     borderColor: "text.secondary",
  //     p: 1,
  //     my: 2,
  //   }}
  // >
  //   <Button
  //     color="secondary"
  //     variant="outlined"
  //     sx={{ borderWidth: 0, "&.Mui-hover": { borderWidth: "0px" } }}
  //     startIcon={<ArrowBack />}
  //     onClick={() => {
  //       setSelectedVideo(null);
  //     }}
  //   >
  //     Go back to all tutorials
  //   </Button>
  //   <Typography variant="h4" sx={{ px: 1 }}>
  //     {selectedVideo?.title}
  //   </Typography>
  //   <Typography sx={{ px: 1, pb: 2 }}>{selectedVideo?.text}</Typography>
  //   <IFrameWrapper maxWidth="900px">
  //     <iframe
  //       loading="lazy"
  //       title={selectedVideo.title}
  //       src={selectedVideo.url}
  //       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  //       allowFullScreen
  //       style={{ border: "0" }}
  //     ></iframe>
  //   </IFrameWrapper>
  // </Paper>
};

export default TutorialOuterPage;
