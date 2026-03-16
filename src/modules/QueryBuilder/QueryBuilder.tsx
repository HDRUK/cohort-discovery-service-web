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
import { CohortBuilderProvider } from "@/providers/CohortBuilderProvider";

const QueryBuilder = ({
  query,
  errorOnDrag = false,
}: {
  query?: Query;
  errorOnDrag?: boolean;
}) => {
  const { queryBuilderJson, setQueryBuilderJson, select, deselect } =
    useQueryBuilder((qb) => ({
      queryBuilderJson: qb.queryBuilderJson,
      setQueryBuilderJson: qb.setQueryBuilderJson,
      select: qb.select,
      deselect: qb.deselect,
      selectedGuidance: qb.selectedGuidance,
    }));

  useEffect(() => {
    if (query?.definition) {
      setQueryBuilderJson(query.definition);
    }
  }, [query, setQueryBuilderJson]);

  useLeaveConfirmation(queryBuilderJson.rules.length > 0);

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
              <RuleBoard ruleGroup={queryBuilderJson} />
            ) : (
              <QueryBuilderSkeleton />
            )
          }
          middleProps={{ ref: boardRef }}
          right={<RuleMenu />}
          rightDisabled={
            !queryBuilderJson ||
            (queryBuilderJson?.rules && queryBuilderJson.rules.length === 0)
          }
        />
        <MarqueeSelection
          containerRef={boardRef}
          selectable='[data-selectable="true"]'
          idAttr="data-id"
          ignoreWhenInside='[data-draggable="true"]'
          onChange={onChangeSelection}
        />
      </ThreePaneProvider>
    </CohortBuilderProvider>
  );
};

export default QueryBuilder;
