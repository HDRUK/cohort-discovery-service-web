"use client";

import TutorialTab from "../components/TutorialTab";
import { helpVideo } from "../helpVideo";
import ResultsBody, { meta } from "./results.mdx";

const ResultsTutorials = () => {
  return <TutorialTab videos={[helpVideo("results", meta, ResultsBody)]} />;
};

export default ResultsTutorials;
