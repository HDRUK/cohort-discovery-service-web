"use client";

import { Button } from "@mui/material";
import { useDaphneStore } from "@/store/useDaphneStore";
import useQueryBuilder from "@/store/useQueryBuilder";
import { useRouter } from "next/navigation";

import { routes } from "@/config/routes";

const SubmitQueryButton = () => {
  const router = useRouter();
  const fetchResults = useDaphneStore((s) => s.userData.fetchResults);
  const { isLoading, setIsLoading } = useDaphneStore((s) => s.stateManagement);

  const { selectedDatasets, queryName, queryBuilderJson } = useQueryBuilder(
    (qb) => ({
      selectedDatasets: qb.selectedDatasets,
      queryName: qb.queryName,
      queryBuilderJson: qb.queryBuilderJson,
    })
  );

  const { valid } = queryBuilderJson;

  const handleClick = async () => {
    setIsLoading(true);
    fetchResults(queryName).then(async (res) => {
      const newPid = res.data.query_pid;
      setIsLoading(false);
      router.replace(routes.dashboardQueryResult(newPid));
    });
  };

  const disabled = selectedDatasets.length === 0 || !valid || isLoading;

  return (
    <Button
      component="span"
      variant="outlined"
      disabled={disabled}
      sx={(theme) => ({
        borderRadius: 20,
        borderWidth: 1,

        borderColor: theme.palette.text.secondary,
        backgroundColor: !disabled
          ? theme.palette.common.white
          : theme.palette.background.default,
        color: theme.palette.text.primary,

        fontWeight: 500,
        fontSize: 15,

        "&:hover": {
          borderWidth: 1,
          borderColor: "transparent",
          backgroundColor: theme.palette.action.hover,
        },

        "&.Mui-disabled": {
          borderWidth: 1,
          borderColor: theme.palette.action.disabledBackground,
          color: theme.palette.text.disabled,
          backgroundColor: "transparent",
        },
      })}
      onClick={(event) => {
        event.stopPropagation();
        event.preventDefault();
        handleClick();
      }}
    >
      Run Query
    </Button>
  );
};

export default SubmitQueryButton;
