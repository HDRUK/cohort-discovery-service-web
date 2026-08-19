import DataOnboardingBody, {
  meta as dataOnboardingMeta,
} from "@/content/help/data-onboarding.mdx";
import AdvancedQueryBody, {
  meta as advancedQueryMeta,
} from "@/content/help/advanced-query.mdx";
import HistoryBody, { meta as historyMeta } from "@/content/help/history.mdx";
import ResultsBody, { meta as resultsMeta } from "@/content/help/results.mdx";
import SimpleQueryBody, {
  meta as simpleQueryMeta,
} from "@/content/help/simple-query.mdx";
import { HelpSection, HelpVideo, HelpVideoMeta } from "@/types/help";
import { getYouTubeThumbnail } from "@/utils/youtube";

// Ordered list of tutorial tabs. `id` is both the tab identity and the
// /help/<id> URL slug — keep it in sync with HelpSectionId.
const HELP_SECTIONS: HelpSection[] = [
  { id: "query-building-tutorials", title: "Query Building Tutorials" },
  { id: "results-tutorials", title: "Results Tutorials" },
  { id: "history-tutorials", title: "History Tutorials" },
  { id: "collection-admin-tutorials", title: "Collection Admin Tutorials" },
];

type MdxTutorial = {
  id: string;
  meta: HelpVideoMeta;
  Body: HelpVideo["Body"];
};

// Each tutorial is one .mdx file; `id` is used for the ?tutorial-id= param.
const TUTORIALS: MdxTutorial[] = [
  { id: "simple-query", meta: simpleQueryMeta, Body: SimpleQueryBody },
  { id: "advanced-query", meta: advancedQueryMeta, Body: AdvancedQueryBody },
  { id: "results", meta: resultsMeta, Body: ResultsBody },
  { id: "history", meta: historyMeta, Body: HistoryBody },
  { id: "data-onboarding", meta: dataOnboardingMeta, Body: DataOnboardingBody },
];

const HELP_VIDEOS: HelpVideo[] = TUTORIALS.map(({ id, meta, Body }) => ({
  ...meta,
  id,
  Body,
  thumbnail: getYouTubeThumbnail(meta.youtube) ?? "",
  thumbnailFallback: getYouTubeThumbnail(meta.youtube, "hqdefault") ?? "",
}));

export { HELP_SECTIONS, HELP_VIDEOS };
