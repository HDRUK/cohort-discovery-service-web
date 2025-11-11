"use client";

import { Button } from "@mui/material";
import { useDaphneStore } from "@/store/useDaphneStore";
import useQueryBuilder from "@/store/useQueryBuilder";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { revalidateAction } from "@/actions/revalidate";

const SubmitQueryButton = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fetchResults = useDaphneStore((s) => s.userData.fetchResults);
  const { isLoading, setIsLoading } = useDaphneStore((s) => s.stateManagement);

  const { selectedDatasets, queryName, queryBuilderJson } = useQueryBuilder(
    (qb) => ({
      selectedDatasets: qb.selectedDatasets,
      queryName: qb.queryName,
      queryBuilderJson: qb.queryBuilderJson,
    })
  );

  const { valid } = queryBuilderJson;

  const handleClick = async () => {
    setIsLoading(true);
    fetchResults(queryName).then(async (res) => {
      const params = new URLSearchParams(searchParams.toString());
      const newPid = res.data.query_pid;

      //needs to be used queries
      revalidateAction("queries");
      setIsLoading(false);

      params.set("query", newPid);
      router.replace(`?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <Button
      disabled={selectedDatasets.length === 0 || !valid || isLoading}
      variant="contained"
      color="primary"
      onClick={handleClick}
    >
      Run query
    </Button>
  );
};

export default SubmitQueryButton;
