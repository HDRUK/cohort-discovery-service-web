import { CollectionStatus } from "@/types/api";
import type { ChipProps } from "@mui/material/Chip";
import { getEnumLabel } from "./string";

const statusColorMap: Record<CollectionStatus, ChipProps["color"]> = {
  [CollectionStatus.DRAFT]: "info",
  [CollectionStatus.ACTIVE]: "success",
  [CollectionStatus.PENDING]: "info",
  [CollectionStatus.REJECTED]: "error",
  [CollectionStatus.SUSPENDED]: "warning",
};

//temporary measure until we either change in the BE or use translations
const statusLabelMap: Partial<Record<CollectionStatus, string>> = {
  [CollectionStatus.SUSPENDED]: "Offline",
};

export const getCollectionStatus = (status: CollectionStatus) => {
  const label =
    statusLabelMap[status] ?? getEnumLabel(CollectionStatus, status);
  const color = statusColorMap[status];
  return { label, color };
};
