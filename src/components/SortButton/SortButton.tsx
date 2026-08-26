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
import { useCallback, useMemo } from "react";
import { useLogDependencyChanges } from "@/utils/deps";

export interface SortButtonProps {
  fields: { field: string; displayName: string; numeric: boolean }[];
  searchParamName?: string;
}

const SortButton = ({ fields, searchParamName = "sort" }: SortButtonProps) => {
  const { getSearchParam, setSearchParam, clearSearchParams } =
    useSearchParams(searchParamName);
  const currentField = getSearchParam()?.split(":")[0];
  const currentSortDirection = getSearchParam()?.split(":")[1];

  const handleSort = useCallback(
    (field: string, direction: SortDirection) => {
      if (field !== currentField || direction !== currentSortDirection) {
        setSearchParam(`${field}:${direction}`);
      }
    },
    [currentSortDirection, currentField, setSearchParam],
  );

  const items = useMemo(() => {
    const itemsArr: PositionedMenuItem[] = [
      {
        id: "none",
        label: (
          <Typography
            component="span"
            sx={{ display: "flex", alignItems: "center" }}
            fontWeight={!currentField ? "bold" : "normal"}
          >
            <SortAscendingIcon sx={{ mr: 1 }} /> Clear sorting
          </Typography>
        ),
        onClick: () => clearSearchParams(),
      },
      ...fields.flatMap(({ field, displayName, numeric }) => [
        {
          id: `${field}:${SortDirection.ASCENDING}`,
          label: (
            <Typography
              component="span"
              sx={{ display: "flex", alignItems: "center" }}
              fontWeight={
                currentField === field &&
                currentSortDirection === SortDirection.ASCENDING
                  ? "bold"
                  : "normal"
              }
            >
              <SortAscendingIcon sx={{ mr: 1 }} /> Sort by {displayName}{" "}
              {numeric ? "(Low-High)" : "(A-Z)"}
            </Typography>
          ),
          onClick: () => handleSort(field, SortDirection.ASCENDING),
        },
        {
          id: `${field}:${SortDirection.DESCENDING}`,
          label: (
            <Typography
              component="span"
              sx={{ display: "flex", alignItems: "center" }}
              fontWeight={
                currentField === field &&
                currentSortDirection === SortDirection.DESCENDING
                  ? "bold"
                  : "normal"
              }
            >
              <SortDescendingIcon sx={{ mr: 1 }} /> Sort by {displayName}{" "}
              {numeric ? "(High-Low)" : "(Z-A)"}
            </Typography>
          ),
          onClick: () => handleSort(field, SortDirection.DESCENDING),
        },
      ]),
    ];

    return itemsArr;
  }, [
    currentField,
    clearSearchParams,
    fields,
    currentSortDirection,
    handleSort,
  ]);

  return (
    <PositionedMenu
      isIcon
      items={items}
      active={!!currentField}
      aria-label="Sort"
    >
      <SortIcon sx={{ width: 20, height: 20 }} />
    </PositionedMenu>
  );
};

export default SortButton;
