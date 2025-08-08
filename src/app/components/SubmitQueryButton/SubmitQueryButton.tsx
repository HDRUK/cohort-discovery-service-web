"use client";

import { Button } from "@mui/material";
import { useDaphneStore } from "@/store/useDaphneStore";
import { revalidateAction } from "@/actions/revalidate";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const SubmitQueryButton = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    userData: { fetchResults },
    queryBuilder: { selectedDatasets },
  } = useDaphneStore();

  const handleClick = async () => {
    revalidateAction("queries");
    fetchResults().then((res) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("query", res.data.query_pid);
      router.replace(`?${params.toString()}`);
    });
  };

  return (
    <Button
      disabled={selectedDatasets.length === 0}
      variant="contained"
      color="primary"
      onClick={handleClick}
    >
      Run query
    </Button>
  );
};

export default SubmitQueryButton;
