"use client";

import HistoryActions from "@/content/guidance/components/HistoryActions";
import ActionMenuSection from "@/components/ActionMenuSection";
import { Typography } from "@mui/material";
import { CustomH1 } from "@/components/GuidanceHeaders";

const QueryHistoryGuidance = (
  selectedIds: string[],
  resultsView: boolean = false,
) => {
  const empty = !selectedIds.length;

  const multiple = !empty && selectedIds.length > 1;

  return (
    <ActionMenuSection
      title={
        resultsView
          ? "Results"
          : `Result History${multiple ? " Bulk Actions" : ""}`
      }
      fixedExpanded
      scrollable
    >
      {empty &&
        !resultsView &&
        "Select a result row to edit a previous query, rerun it to generate updated results, download the output, or remove it from your list. You can also select multiple to bulk delete or download."}
      {!empty && (
        <HistoryActions multiple={multiple} selectedIds={selectedIds} />
      )}
      <CustomH1>Result Interpretation</CustomH1>
      Please note that results show rounded cohort counts not exact patient
      numbers. Low count suppression is applied to results to protect
      identification, so &apos;0&apos; counts may mean no results or be a
      suppressed low value. This is set by each data collection, but typically
      is for counts below 10.
      <CustomH1>Statuses</CustomH1>
      <Typography>
        <b>Pending</b> — The query is currently running and are awaiting the
        return of results.
      </Typography>
      <Typography>
        <b>Completed</b> — The query has finished for this collection and the
        total count is finalised.
      </Typography>
      <Typography>
        <b>Error</b> — The query could not be completed for this collection due
        to an issue on the data custodian side. Please re-run the query and if
        issues persist please feel free to contact the Gateway Helpdesk.
      </Typography>
    </ActionMenuSection>
  );
};

export default QueryHistoryGuidance;
