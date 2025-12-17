import { Query, Task } from "@/types/api";
import { isEqualTask } from "@/utils/distributions";
import CheckIcon from "@mui/icons-material/Check";
import { Button, CircularProgress } from "@mui/material";
import { useState } from "react";

interface ReRunButtonProps {
  task?: Task;
  lastSuccessfullTask?: Task;
  onClick: () => Promise<Query>;
}

export const ReRunButton = ({
  lastSuccessfullTask,
  task,
  onClick,
}: ReRunButtonProps) => {
  const taskIncomplete = Boolean(task && !task.completed_at);
  const [currentTask, setCurrentTask] = useState<Task | null>(task ?? null);

  const handleClick = async () => {
    setCurrentTask(null);
    const newQuery = await onClick();
    const [newTask] = newQuery.tasks;
    setCurrentTask(newTask);
  };

  const isLastSuccessfullTask =
    !!lastSuccessfullTask &&
    !!currentTask &&
    isEqualTask(currentTask, lastSuccessfullTask);

  const taskLoading =
    currentTask === null || (taskIncomplete && task?.id !== currentTask?.id);

  const isLoading = !lastSuccessfullTask
    ? false
    : taskLoading || !isLastSuccessfullTask;

  return (
    <Button
      loadingPosition="end"
      color="inherit"
      size="small"
      variant="text"
      onClick={handleClick}
    >
      Run now
      {isLoading && <CircularProgress sx={{ mx: 1 }} size={15} />}
      {isLastSuccessfullTask && <CheckIcon color="success" />}
    </Button>
  );
};
