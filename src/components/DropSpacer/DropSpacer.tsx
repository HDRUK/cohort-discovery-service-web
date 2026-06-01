"use client";

import { Box } from "@mui/material";
import { useDroppable } from "@dnd-kit/core";
import { DragType } from "@/types/dnd";

const DropSpacer = ({
  id,
  groupId,
  position,
  isVisible = false,
}: {
  id: string;
  groupId: string;
  position: "top" | "bottom" | number;
  isVisible?: boolean;
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      id,
      type: DragType.Spacer,
      position,
      groupId,
    },
  });
  return (
    <Box
      ref={setNodeRef}
      sx={{
        p: 0,
        height: isVisible ? 20 : 0,
        transition: "height 120ms",
        outline: isVisible && isOver ? "2px dashed #9aa0a6" : "none",
      }}
    />
  );
};

export default DropSpacer;
