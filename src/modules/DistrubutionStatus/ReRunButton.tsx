import { Query, Task } from "@/types/api";
import { isEqualTask } from "@/utils/distributions";

import { Button } from "@mui/material";
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

  const taskLoading = taskIncomplete && task?.id !== currentTask?.id;

  const isLastSuccessfullTask =
    !!lastSuccessfullTask &&
    !!currentTask &&
    isEqualTask(currentTask, lastSuccessfullTask);

  const isLoading =
    currentTask === null || taskLoading || !isLastSuccessfullTask;

  return (
    <Button
      disabled={isLoading}
      loading={isLoading}
      loadingPosition="end"
      color="inherit"
      size="small"
      variant="text"
      onClick={handleClick}
    >
      Run now
    </Button>
  );
};
