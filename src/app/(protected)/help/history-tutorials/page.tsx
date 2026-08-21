"use client";

import TutorialTab from "../components/TutorialTab";
import { helpVideo } from "../helpVideo";
import HistoryBody, { meta } from "./history.mdx";

const HistoryTutorials = () => {
  return <TutorialTab videos={[helpVideo("history", meta, HistoryBody)]} />;
};

export default HistoryTutorials;
