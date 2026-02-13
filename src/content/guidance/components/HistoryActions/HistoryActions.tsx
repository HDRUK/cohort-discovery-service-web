"use client";

import { Stack, Typography } from "@mui/material";
import deleteQueries from "@/actions/deleteQueries";
import getQuery from "@/actions/getQuery";
import rerunQuery from "@/actions/rerunQuery";
import DeleteMenuItem from "@/components/DeleteMenuItem";
import DownloadButton, {
  AvailableFormats,
} from "@/components/DownloadButton/DownloadButton";
import EditButton from "@/components/EditButton";
import ReRunButton from "@/components/ReRunButton";
import { routes } from "@/config/routes";
import useSearchParams from "@/hooks/useSearchParams";
import { useNotify } from "@/providers/NotifyProvider";
import { useRouter } from "next/navigation";
import useQueryBuilder from "@/hooks/useQueryBuilder";

const HistoryActions = ({
  multiple = false,
  selectedIds,
}: {
  multiple: boolean;
  selectedIds: string[];
}) => {
  const { searchParams } = useSearchParams();
  const router = useRouter();
  const notify = useNotify();
  const { setQueryBuilderJson, setSelectedDatasets, setQueryName } =
    useQueryBuilder((qb) => ({
      resetQueryBuilderJson: qb.resetQueryBuilderJson,
      setSelectedDatasets: qb.setSelectedDatasets,
      setQueryBuilderJson: qb.setQueryBuilderJson,
      setQueryName: qb.setQueryName,
    }));
  console.log(selectedIds);

  const onDeleteClick = () => {
    console.log("here", selectedIds);
    const response = deleteQueries(selectedIds);
    console.log(response);
    const openQueries = (searchParams.get("open_queries") || "")
      .split(",")
      .filter((q) => q && !(q in selectedIds));
    router.push(routes.dashboardHistory(openQueries));
    notify.success("Deleted query");
  };

  return (
    <Stack>
      {!multiple && (
        <ReRunButton
          label="Re-run query"
          onClick={async () => {
            const { data } = await rerunQuery(selectedIds[0]);
            const openQueries = (searchParams.get("open_queries") || "")
              .split(",")
              .filter((q) => q);
            if (openQueries.indexOf(data.query_pid) === -1) {
              openQueries.push(data.query_pid);
            }
            router.push(
              routes.dashboardQueryResult(data.query_pid, openQueries),
            );
          }}
          text="Re-run"
        />
      )}
      {!multiple && (
        <EditButton
          onClick={async () => {
            const result = await getQuery(selectedIds[0]);
            const ranCollectionPids = result.data.tasks.map(
              (t) => t.collection.pid,
            );
            setSelectedDatasets(ranCollectionPids);
            setQueryName("");
            setQueryBuilderJson(result.data.definition);
            const openQueries = (searchParams.get("open_queries") || "")
              .split(",")
              .filter((q) => q);
            router.push(
              routes.dashboardNewQuery(openQueries, `query=${result.data.pid}`),
            );
          }}
          label="Edit"
          size="large"
        />
      )}
      <DownloadButton
        id={selectedIds[0]}
        entity="queries"
        formats={[AvailableFormats.JSON]}
        isIcon={false}
      />
      <DeleteMenuItem label="Delete" action={onDeleteClick} size="large" />
    </Stack>
  );
};

export default HistoryActions;
