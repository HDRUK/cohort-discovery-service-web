"use client";

import { Button } from "@mui/material";
import { useDaphneStore } from "../store/useDaphneStore";

const SubmitQueryButton = () => {
  const { getQuery } = useDaphneStore();

  const handleClick = () => {
    getQuery();
  };

  return <Button onClick={handleClick}> Click me!</Button>;
};

export default SubmitQueryButton;
