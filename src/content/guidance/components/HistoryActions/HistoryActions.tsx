"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import getQuery from "@/actions/query/getQuery";
import rerunQuery from "@/actions/query/rerunQuery";
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
import deleteQueries from "@/actions/query/deleteQueries";
import RenameButton from "@/components/RenameButton";

const HistoryActions = ({
  multiple = false,
  selectedIds,
  onClear,
  resultsView = false,
  onRenaming,
}: {
  multiple: boolean;
  selectedIds: string[];
  onClear?: () => void;
  resultsView?: boolean;
  onRenaming?: (queryId: string | null) => void;
}) => {
  const { searchParams } = useSearchParams();
  const router = useRouter();
  const notify = useNotify();
  const { setQueryBuilderJson, setSelectedDatasets, setQueryName } =
    useQueryBuilder((qb) => ({
      setSelectedDatasets: qb.setSelectedDatasets,
      setQueryBuilderJson: qb.setQueryBuilderJson,
      setQueryName: qb.setQueryName,
    }));

  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmationValue, setConfirmationValue] = useState(false);

  const handleConfirmationChange = () => {
    setConfirmationValue(!confirmationValue);
  };

  const handleCancel = () => {
    setDialogOpen(false);
  };

  const handleDelete = async () => {
    await deleteQueries(selectedIds);
    onClear?.();

    const openQueries = (searchParams.get("open_queries") || "")
      .split(/,|%2C/)
      .filter((q) => q && !selectedIds.includes(q));
    router.push(routes.dashboardHistory(openQueries));
    notify.success(`Deleted ${multiple ? "queries" : "query"}`);
    setDialogOpen(false);
  };

  const onDeleteClick = () => {
    setConfirmationValue(false);
    setDialogOpen(true);
  };

  return (
    <Stack>
      {!multiple && !resultsView && (
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
          size="medium"
        />
      )}
      {!multiple && !resultsView && (
        <RenameButton
          label="Rename query"
          onClick={(isEditing) =>
            onRenaming?.(isEditing ? selectedIds[0] : null)
          }
          text="Rename"
          size="medium"
        />
      )}
      {!multiple && (
        <EditButton
          label="Edit"
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
          size="medium"
        />
      )}
      {!multiple && (
        <DownloadButton
          ids={selectedIds}
          entity="queries"
          formats={[AvailableFormats.JSON]}
          isIcon={false}
        />
      )}
      {!resultsView && (
        <>
          <DeleteMenuItem
            label="Delete"
            action={onDeleteClick}
            size="medium"
            sx={{
              justifyContent: "flex-start",
              textAlign: "left",
              color: "text.primary",
              fontWeight: "normal",
              fontSize: 14,
              "&.MuiButton-root:hover": {
                backgroundColor: "highlight.main",
              },
            }}
          />
          <Dialog open={dialogOpen}>
            <Box display="flex" justifyContent="right" padding={1}>
              <IconButton
                onClick={handleCancel}
                size="small"
                aria-label="close"
                color="secondary"
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              px={15}
              pb={3}
            >
              <Typography textAlign="center">
                Are you sure you want to delete{" "}
                {multiple ? "these query results" : "this query result"}?
              </Typography>
              <DialogContent>
                <FormControl>
                  <FormControlLabel
                    control={<Checkbox />}
                    checked={confirmationValue}
                    label="I understand this action is permanent"
                    onChange={handleConfirmationChange}
                  />
                </FormControl>
              </DialogContent>
              <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  disabled={!confirmationValue}
                  onClick={handleDelete}
                  variant="outlined"
                >
                  Yes
                </Button>
                <Button autoFocus onClick={handleCancel} color="secondary">
                  No
                </Button>
              </DialogActions>
            </Box>
          </Dialog>
        </>
      )}
    </Stack>
  );
};

export default HistoryActions;
