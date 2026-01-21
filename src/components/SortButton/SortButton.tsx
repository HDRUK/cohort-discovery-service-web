"use client";

import { SortIcon } from "@/icons/SortIcon";
import PositionedMenu, {
  PositionedMenuItem,
} from "../PositionedMenu/PositionedMenu";
import useSearchParams from "@/hooks/useSearchParams";
import { SortDirection } from "@/types/common";
import { Typography } from "@mui/material";
import { SortAscendingIcon } from "@/icons/SortAscendingIcon";
import { SortDescendingIcon } from "@/icons/SortDescendingIcon";
import { useCallback } from "react";

export interface SortButtonProps {
  field: string;
  searchParamName?: string;
}

const SortButton = ({ field, searchParamName = "sort" }: SortButtonProps) => {
  const { getSearchParam, setSearchParam } = useSearchParams(searchParamName);
  const currentSortDirection = getSearchParam()?.split(":")[1];

  const handleSort = useCallback(
    (direction: SortDirection) => {
      setSearchParam(
        direction !== currentSortDirection ? `${field}:${direction}` : null,
      );
    },
    [field, currentSortDirection, setSearchParam],
  );

  const items: PositionedMenuItem[] = [
    {
      id: SortDirection.ASCENDING,
      label: (
        <Typography
          component="span"
          sx={{ display: "flex", alignItems: "center" }}
          fontWeight={
            currentSortDirection == SortDirection.ASCENDING ? "bold" : "normal"
          }
        >
          <SortAscendingIcon sx={{ mr: 1 }} /> Sort alphabetically (A-Z)
        </Typography>
      ),
      onClick: () => handleSort(SortDirection.ASCENDING),
    },
    {
      id: SortDirection.DESCENDING,
      label: (
        <Typography
          component="span"
          sx={{ display: "flex", alignItems: "center" }}
          fontWeight={
            currentSortDirection == SortDirection.DESCENDING ? "bold" : "normal"
          }
        >
          <SortDescendingIcon sx={{ mr: 1 }} /> Sort alphabetically (Z-A)
        </Typography>
      ),
      onClick: () => handleSort(SortDirection.DESCENDING),
    },
  ];

  return (
    <PositionedMenu isIcon items={items} active={!!currentSortDirection}>
      <SortIcon sx={{ width: 20, height: 20 }} />
    </PositionedMenu>
  );
};

export default SortButton;
