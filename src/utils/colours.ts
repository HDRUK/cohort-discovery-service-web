import { CollectionStatus } from "@/types/api";
import type { ChipProps } from "@mui/material/Chip";
import { getEnumLabel } from "./string";

const statusColorMap: Record<CollectionStatus, ChipProps["color"]> = {
  [CollectionStatus.ACTIVE]: "success",
  [CollectionStatus.INACTIVE]: "error",
  [CollectionStatus.SUSPENDED]: "warning",
};

export const getCollectionStatus = (status: CollectionStatus) => {
  const label = getEnumLabel(CollectionStatus, status);
  const color = statusColorMap[status];
  return { label, color };
};
