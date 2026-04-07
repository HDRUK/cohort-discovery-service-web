"use client";

import { use } from "react";
import TutorialPage from "../../components/TutorialPage";

const TutorialOuterPage = ({
  params,
}: {
  params: Promise<{ tutorialId: string }>;
}) => {
  const { tutorialId } = use(params);

  return TutorialPage({ tutorialId: tutorialId });
};

export default TutorialOuterPage;
