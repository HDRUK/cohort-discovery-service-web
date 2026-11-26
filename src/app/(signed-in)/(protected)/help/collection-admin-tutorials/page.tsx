"use client";

import TutorialTab from "../components/TutorialTab";
import { helpVideo } from "../helpVideo";
import DataOnboardingBody, { meta } from "./data-onboarding.mdx";

const CollectionAdminTutorials = () => {
  return (
    <TutorialTab
      videos={[helpVideo("data-onboarding", meta, DataOnboardingBody)]}
    />
  );
};

export default CollectionAdminTutorials;
