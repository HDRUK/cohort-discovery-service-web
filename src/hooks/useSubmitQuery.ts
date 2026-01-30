import useUserStore from "@/hooks/useUserStore";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import useStateManagement from "@/hooks/useStateManagement";
import { useRouter, useSearchParams } from "next/navigation";

import { routes } from "@/config/routes";
import { useEffect } from "react";

const useSubmitQuery = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const fetchResults = useUserStore((s) => s.fetchResults);
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

  const submit = async () => {
    setIsLoading(true);
    try {
      const res = await fetchResults(queryName);
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
    } catch (e) {
      setIsLoading(false);
      throw e;
    }
  };

  const disabled = selectedDatasets.length === 0 || !valid || isLoading;

  return { submit, disabled };
};

export default useSubmitQuery;
