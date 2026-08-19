"use client";

import TutorialTab from "../components/TutorialTab";
import { helpVideo } from "../helpVideo";
import AdvancedQueryBody, {
  meta as advancedQueryMeta,
} from "./advanced-query.mdx";
import SimpleQueryBody, { meta as simpleQueryMeta } from "./simple-query.mdx";

const QueryBuildingTutorials = () => {
  return (
    <TutorialTab
      videos={[
        helpVideo("simple-query", simpleQueryMeta, SimpleQueryBody),
        helpVideo("advanced-query", advancedQueryMeta, AdvancedQueryBody),
      ]}
    />
  );
};

export default QueryBuildingTutorials;
