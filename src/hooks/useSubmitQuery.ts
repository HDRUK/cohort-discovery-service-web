import useQueryBuilder from "@/hooks/useQueryBuilder";
import useStateManagement from "@/hooks/useStateManagement";
import { useRouter, useSearchParams } from "next/navigation";
import { useNotify } from "@/providers/NotifyProvider";
import {
  handleQuerySubmissionError,
  QUERY_LIMIT_REACHED_MESSAGE,
} from "@/utils/queryErrors";

import { routes } from "@/config/routes";
import { useEffect } from "react";
import useIsQueryLimitReached from "@/hooks/useIsQueryLimitReached";
import submitQuery from "@/actions/query/submitQuery";

const useSubmitQuery = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const notify = useNotify();

  const isQueryLimitReached = useIsQueryLimitReached();
  const { isLoading, setIsLoading } = useStateManagement((s) => ({
    isLoading: s.isLoading,
    setIsLoading: s.setIsLoading,
  }));

  useEffect(() => {
    return () => {
      setIsLoading(false);
    };
  }, [setIsLoading]);

  const { selectedDatasets, queryName, queryBuilderJson } = useQueryBuilder(
    (qb) => ({
      selectedDatasets: qb.selectedDatasets,
      queryName: qb.queryName,
      queryBuilderJson: qb.queryBuilderJson,
    }),
  );

  const { valid } = queryBuilderJson;

  const submit = async (): Promise<boolean> => {
    setIsLoading(true);
    const res = await submitQuery(
      queryBuilderJson,
      queryName ? queryName : null,
      selectedDatasets,
    );

    if (res.error) {
      setIsLoading(false);
      handleQuerySubmissionError(res.error, notify);
      return false;
    }

    const newPid = res.data.query_pid;
    const openQueries = searchParams.get("open_queries");
    const arrayOpenQueries = (openQueries ?? "").split(",");
    arrayOpenQueries.push(newPid);
    router.push(
      routes.dashboardQueryResult(
        newPid,
        arrayOpenQueries.filter((q) => q) ?? [],
      ),
    );
    return true;
  };

  const disabled =
    selectedDatasets.length === 0 || !valid || isLoading || isQueryLimitReached;
  const disabledReason = isQueryLimitReached
    ? QUERY_LIMIT_REACHED_MESSAGE
    : undefined;

  return { submit, disabled, disabledReason };
};

export default useSubmitQuery;
