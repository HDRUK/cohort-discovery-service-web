"use client";

import { IconButton } from "@mui/material";
import { useDaphneStore } from "@/store/useDaphneStore";
import useQueryBuilder from "@/store/useQueryBuilder";
import { useRouter } from "next/navigation";
import { revalidateAction } from "@/actions/revalidate";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
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

      //needs to be used queries
      revalidateAction("queries");
      setIsLoading(false);

      router.replace(routes.dashboardQueryResult(newPid));
    });
  };

  return (
    <IconButton
      component="span"
      disabled={selectedDatasets.length === 0 || !valid || isLoading}
      onClick={(event) => {
        event.stopPropagation();
        event.preventDefault();
        handleClick();
      }}
    >
      <ArrowForwardIcon sx={{ color: "white" }} />
    </IconButton>
  );
};

export default SubmitQueryButton;
