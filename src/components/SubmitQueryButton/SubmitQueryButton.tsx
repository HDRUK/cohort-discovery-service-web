"use client";

import { Button } from "@mui/material";
import { useDaphneStore } from "@/store/useDaphneStore";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { revalidateAction } from "@/actions/revalidate";

const SubmitQueryButton = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fetchResults = useDaphneStore((s) => s.userData.fetchResults);

  const selectedDatasets = useDaphneStore(
    (s) => s.queryBuilder.selectedDatasets
  );
  const queryName = useDaphneStore((s) => s.queryBuilder.queryName);
  const queryBuilderJson = useDaphneStore(
    (s) => s.queryBuilder.queryBuilderJson
  );

  const isLoading = useDaphneStore((s) => s.stateManagement.isLoading);
  const setIsLoading = useDaphneStore((s) => s.stateManagement.setIsLoading);

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
