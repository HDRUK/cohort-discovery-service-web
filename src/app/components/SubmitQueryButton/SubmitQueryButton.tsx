"use client";

import { Button } from "@mui/material";
import { useDaphneStore } from "@/store/useDaphneStore";
import { revalidateAction } from "@/actions/revalidate";
import { useRouter } from "next/navigation";

const SubmitQueryButton = () => {
  const router = useRouter();
  const {
    userData: { fetchResults },
    queryBuilder: { selectedDatasets },
  } = useDaphneStore();

  const handleClick = () => {
    fetchResults();
    revalidateAction("queries");
    router.push("history");
  };

  return (
    <Button
      disabled={selectedDatasets.length === 0}
      variant="contained"
      color="secondary"
      onClick={handleClick}
    >
      Run query
    </Button>
  );
};

export default SubmitQueryButton;
