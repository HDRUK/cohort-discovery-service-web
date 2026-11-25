"use client";
import useQueryBuilder from "@/hooks/useQueryBuilder";

import { Typography } from "@mui/material";
import { useCallback, useRef, useEffect } from "react";
import ActionMenu from "../ActionMenu";
import RuleMenu from "../RuleMenu";

import { QueryBuilderSkeleton } from "./QueryBuilderSkeleton";
import MarqueeSelection from "@/components/MarqueeSelection";
import { Query } from "@/types/api";
import ThreePaneSwimLaneLayout from "../ThreePaneSwimLaneLayout";
import { ThreePaneProvider } from "@/providers/ThreePaneProvider";
import { useLeaveConfirmation } from "@/hooks/useLeaveConfirmation";
import RuleBoard from "../RuleBoard";
import DemographicsPanel from "../DemographicsPanel";
import { CohortBuilderProvider } from "@/providers/CohortBuilderProvider";
import useFeatures from "@/hooks/useFeatures";
import useSearchParams from "@/hooks/useSearchParams";

interface QueryBuilderProps {
  query?: Query;
  errorOnDrag?: boolean;
}

const QueryBuilderBoard = ({
  query,
  errorOnDrag = false,
}: QueryBuilderProps) => {
  const { queryBuilderLeaveConfirm, queryBuilderUseDemographicRule } =
    useFeatures();
  const { queryBuilderJson, setQueryBuilderJson, select, deselect } =
    useQueryBuilder((qb) => ({
      queryBuilderJson: qb.queryBuilderJson,
      setQueryBuilderJson: qb.setQueryBuilderJson,
      select: qb.select,
      deselect: qb.deselect,
      selectedGuidance: qb.selectedGuidance,
    }));

  const showDemographics =
    queryBuilderUseDemographicRule && !!queryBuilderJson.demographics;

  const { searchParams } = useSearchParams();
  const urlQueryPid = searchParams.get("query");

  useEffect(() => {
    if (query?.definition && query.pid === urlQueryPid) {
      setQueryBuilderJson(query.definition);
    }
  }, [query, urlQueryPid, setQueryBuilderJson]);

  useLeaveConfirmation(
    queryBuilderLeaveConfirm && queryBuilderJson.rules.length > 0,
  );

  const onChangeSelection = useCallback(
    (ids: string[], deselectedIds: string[]) => {
      select(ids);
      deselect(deselectedIds);
    },
    [deselect, select],
  );

  const boardRef = useRef<HTMLDivElement>(null);

  return (
    <CohortBuilderProvider errorOnDrag={errorOnDrag}>
      <ThreePaneProvider>
        <ThreePaneSwimLaneLayout
          left={<ActionMenu />}
          middle={
            queryBuilderJson?.rules && queryBuilderJson.rules.length > 0 ? (
              <RuleBoard ruleGroup={queryBuilderJson} scrollable />
            ) : (
              <QueryBuilderSkeleton />
            )
          }
          middleProps={{
            ref: boardRef,
            topSlot: showDemographics ? (
              <DemographicsPanel key={queryBuilderJson.demographics?.id} />
            ) : undefined,
          }}
          right={<RuleMenu />}
          rightDisabled={
            !queryBuilderJson ||
            (queryBuilderJson.rules.length === 0 && !showDemographics)
          }
        />
        <MarqueeSelection
          containerRef={boardRef}
          selectable='[data-selectable="true"]'
          idAttr="data-id"
          ignoreWhenInside='[data-draggable="true"], [data-marquee-ignore="true"]'
          onChange={onChangeSelection}
        />
      </ThreePaneProvider>
    </CohortBuilderProvider>
  );
};

const QueryBuilder = (props: QueryBuilderProps) => {
  const { queryBuilder } = useFeatures();

  if (!queryBuilder) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
        The query builder is switched off. Ask an administrator to turn it on.
      </Typography>
    );
  }

  return <QueryBuilderBoard {...props} />;
};

export default QueryBuilder;
