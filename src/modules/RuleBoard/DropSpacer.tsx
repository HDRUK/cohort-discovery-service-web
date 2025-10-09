"use client";

import { Box } from "@mui/material";

import { useDroppable } from "@dnd-kit/core";
import React from "react";

const DropSpacer = ({
  id,
  isVisible = false,
}: {
  id: string;
  isVisible?: boolean;
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <Box
      ref={setNodeRef}
      sx={{
        height: isVisible ? 10 : 0,
        transition: "height 120ms",
        my: 1,
        mx: 1,
        outline: isVisible && isOver ? "2px dashed #9aa0a6" : "none",
      }}
    />
  );
};

export default DropSpacer;
