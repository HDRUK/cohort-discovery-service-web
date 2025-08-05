"use client";

import { Button } from "@mui/material";
import { useDaphneStore } from "@/store/useDaphneStore";

const SubmitQueryButton = () => {
  const { getResults } = useDaphneStore();

  const handleClick = () => {
    getResults();
  };

  return (
    <Button variant="contained" color="secondary" onClick={handleClick}>
      Run query
    </Button>
  );
};

export default SubmitQueryButton;
