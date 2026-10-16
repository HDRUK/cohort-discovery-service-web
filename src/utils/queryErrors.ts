import { ApiError } from "@/lib/https";
import { NotifyFn } from "@/providers/NotifyProvider";
import { useUserDataStore } from "@/hooks/userDataStore";

export const QUERY_LIMIT_REACHED_MESSAGE =
  "You've reached your monthly query limit. Try again next month.";

const handleQueryRateLimitError = (
  error: { code: number; text: string },
  notify: NotifyFn,
): void => {
  if (error.code === 429) {
    useUserDataStore.getState().markQueryLimitReached();
    notify({
      message: QUERY_LIMIT_REACHED_MESSAGE,
      severity: "error",
      autoHideDuration: null,
      anchorOrigin: { vertical: "top", horizontal: "center" },
    });
    return;
  }
  throw new ApiError(error.code, error.text);
};

export { handleQueryRateLimitError };
