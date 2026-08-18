"use client";
import useQueryBuilder from "@/hooks/useQueryBuilder";

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

const QueryBuilder = ({
  query,
  errorOnDrag = false,
}: {
  query?: Query;
  errorOnDrag?: boolean;
}) => {
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

  useEffect(() => {
    if (query?.definition) {
      setQueryBuilderJson(query.definition);
    }
  }, [query, setQueryBuilderJson]);

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
            topSlot: showDemographics ? <DemographicsPanel /> : undefined,
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

export default QueryBuilder;
