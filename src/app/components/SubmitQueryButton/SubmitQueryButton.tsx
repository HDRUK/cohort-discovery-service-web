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
    queryBuilder: { selectedDatasets },
    stateManagement: { isLoading, setIsLoading },
  } = useDaphneStore();

  const handleClick = async () => {
    setIsLoading(true);
    fetchResults().then(async (res) => {
      const params = new URLSearchParams(searchParams.toString());
      const newPid = res.data.query_pid;

      params.set("query", newPid);
      router.replace(`?${params.toString()}`, { scroll: false });
      revalidateAction("queries");
      setIsLoading(false);
    });
  };

  return (
    <Button
      disabled={selectedDatasets.length === 0 || isLoading}
      variant="contained"
      color="primary"
      onClick={handleClick}
    >
      Run query
    </Button>
  );
};

export default SubmitQueryButton;
