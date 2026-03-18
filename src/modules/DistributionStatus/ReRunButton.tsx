import getTask from "@/actions/task/getTask";
import { useDefaults } from "@/providers/DefaultProvider";
import { Query } from "@/types/api";
import { TaskStatus } from "@/types/tasks";
import { getTaskStatus } from "@/utils/tasks";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Button, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

interface ReRunButtonProps {
  onClick: () => Promise<Query>;
  onSuccess?: () => void;
}

export const ReRunButton = ({ onClick, onSuccess }: ReRunButtonProps) => {
  const defaults = useDefaults();
  const [submittedTaskPid, setSubmittedTaskPid] = useState<string | null>();

  const handleClick = useCallback(async () => {
    setSubmittedTaskPid(null);

    const newQuery = await onClick();
    const newTask = newQuery.tasks?.[0] ?? null;

    setSubmittedTaskPid(newTask?.pid ?? null);
  }, [onClick]);

  const { data: taskResponse, isFetching } = useQuery({
    queryKey: ["task", submittedTaskPid],
    queryFn: () =>
      getTask(submittedTaskPid!, { cacheOptions: { useCache: false } }),
    enabled: !!submittedTaskPid,
    refetchInterval: (query) => {
      const task = query.state.data?.data;
      if (!task) return defaults.tableRefresh;
      const status = getTaskStatus(task);
      return status === TaskStatus.PENDING ? defaults.tableRefresh : false;
    },
  });

  const task = taskResponse?.data;
  const taskStatus = task ? getTaskStatus(task) : null;

  const isPending = taskStatus === TaskStatus.PENDING;
  const isSuccessful = taskStatus === TaskStatus.SUCCESSFUL;
  const hasFailed = taskStatus === TaskStatus.ERROR;
  const isLoading = isFetching || isPending;

  const hasCalledSuccessRef = useRef(false);

  useEffect(() => {
    if (isSuccessful && !hasCalledSuccessRef.current) {
      hasCalledSuccessRef.current = true;
      onSuccess?.();
    }
  }, [isSuccessful, onSuccess]);

  return (
    <Button
      color="inherit"
      size="small"
      variant="text"
      onClick={handleClick}
      disabled={isLoading}
    >
      {task && (
        <>
          {isLoading ? (
            <CircularProgress sx={{ mx: 1 }} size={15} />
          ) : hasFailed ? (
            <CloseIcon color="error" sx={{ mx: 1, fontSize: 20 }} />
          ) : isSuccessful ? (
            <CheckIcon color="success" sx={{ mx: 1, fontSize: 20 }} />
          ) : null}
        </>
      )}
      {isPending ? "Running" : "Run now"}
    </Button>
  );
};
