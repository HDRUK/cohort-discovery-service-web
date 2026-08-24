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
  ];

  for (const fieldObj of fields) {
    const field = fieldObj.field;
    const displayName = fieldObj.displayName;
    const numeric = fieldObj.numeric;

    console.log("field:", field, "displayName:", displayName);

    itemsArr.push(
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
    );
  }

  console.log("itemsArr:", itemsArr);

  // const items: PositionedMenuItem[] = [
  //   {
  //     id: SortDirection.ASCENDING,
  //     label: (
  //       <Typography
  //         component="span"
  //         sx={{ display: "flex", alignItems: "center" }}
  //         fontWeight={
  //           currentSortDirection == SortDirection.ASCENDING ? "bold" : "normal"
  //         }
  //       >
  //         <SortAscendingIcon sx={{ mr: 1 }} /> Sort alphabetically (A-Z)
  //       </Typography>
  //     ),
  //     onClick: () => handleSort(SortDirection.ASCENDING),
  //   },
  //   {
  //     id: SortDirection.DESCENDING,
  //     label: (
  //       <Typography
  //         component="span"
  //         sx={{ display: "flex", alignItems: "center" }}
  //         fontWeight={
  //           currentSortDirection == SortDirection.DESCENDING ? "bold" : "normal"
  //         }
  //       >
  //         <SortDescendingIcon sx={{ mr: 1 }} /> Sort alphabetically (Z-A)
  //       </Typography>
  //     ),
  //     onClick: () => handleSort(SortDirection.DESCENDING),
  //   },
  // ];

  return (
    <PositionedMenu isIcon items={itemsArr} active={!!currentField}>
      <SortIcon sx={{ width: 20, height: 20 }} />
    </PositionedMenu>
  );
};

export default SortButton;
