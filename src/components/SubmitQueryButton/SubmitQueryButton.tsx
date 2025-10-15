"use client";

import { Button } from "@mui/material";
import { useDaphneStore } from "@/store/useDaphneStore";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { revalidateAction } from "@/actions/revalidate";

const SubmitQueryButton = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    userData: { fetchResults },
    queryBuilder: { selectedDatasets, queryName, queryBuilderJson },
    stateManagement: { isLoading, setIsLoading },
  } = useDaphneStore();

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
