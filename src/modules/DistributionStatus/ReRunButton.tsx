import { Query, Task } from "@/types/api";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Button, CircularProgress, Tooltip } from "@mui/material";
import { useCallback, useMemo, useState } from "react";

interface ReRunButtonProps {
  task?: Task;
  onClick: () => Promise<Query>;
}

export const ReRunButton = ({ task, onClick }: ReRunButtonProps) => {
  const [submittedTask, setSubmittedTask] = useState<Task | null>(task ?? null);

  const handleClick = useCallback(async () => {
    setSubmittedTask(null);

    const newQuery = await onClick();
    const newTask = newQuery.tasks?.[0];
    setSubmittedTask(newTask ?? null);
  }, [onClick]);

  const submittedId = submittedTask?.id;

  const hasFailed = useMemo(
    () =>
      submittedTask?.id && task?.id && submittedTask?.id === task?.id
        ? !!task.failed_at
        : false,
    [task, submittedTask],
  );

  const hasNoResult = submittedTask?.result === null;

  const isLoading =
    !hasFailed && !!submittedId && submittedTask.result === null;

  console.log({ isLoading, hasFailed, hasNoResult, submittedTask });

  return (
    <Button
      color="inherit"
      size="small"
      variant="text"
      onClick={handleClick}
      disabled={isLoading}
    >
      {submittedTask && (
        <>
          {isLoading ? (
            <CircularProgress sx={{ mx: 1 }} size={15} />
          ) : hasFailed ? (
            <CloseIcon color="error" sx={{ mx: 1, fontSize: 20 }} />
          ) : (
            <CheckIcon color="success" sx={{ mx: 1, fontSize: 20 }} />
          )}
        </>
      )}
      {isLoading ? "Running" : "Run now"}
    </Button>
  );
};
