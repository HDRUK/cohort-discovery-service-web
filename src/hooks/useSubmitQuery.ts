import { useDaphneStore } from "@/store/useDaphneStore";
import useQueryBuilder from "@/store/useQueryBuilder";
import { useRouter } from "next/navigation";

import { routes } from "@/config/routes";
import { useEffect } from "react";

const useSubmitQuery = () => {
  const router = useRouter();
  const fetchResults = useDaphneStore((s) => s.userData.fetchResults);
  const { isLoading, setIsLoading } = useDaphneStore((s) => s.stateManagement);

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
    })
  );

  const { valid } = queryBuilderJson;

  const submit = async () => {
    setIsLoading(true);
    try {
      const res = await fetchResults(queryName);
      const newPid = res.data.query_pid;
      router.push(routes.dashboardQueryResult(newPid));
    } catch (e) {
      setIsLoading(false);
      throw e;
    }
  };

  const disabled = selectedDatasets.length === 0 || !valid || isLoading;

  return { submit, disabled };
};

export default useSubmitQuery;
