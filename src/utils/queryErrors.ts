import { ApiError } from "@/lib/https";
import { NotifyFn } from "@/providers/NotifyProvider";
import { useQueryLimitStore } from "@/store/queryLimitStore";
import { useSessionStore } from "@/store/sessionStore";

export const QUERY_LIMIT_REACHED_MESSAGE =
  "You've reached your monthly query limit. Try again next month.";

export const SESSION_EXPIRED_MESSAGE =
  "Your session has expired. Redirecting you to sign in again...";

const handleQuerySubmissionError = (
  error: { code: number; text: string },
  notify: NotifyFn,
): void => {
  if (error.code === 401) {
    useSessionStore.getState().endSession();
    return;
  }
  if (error.code === 429) {
    useQueryLimitStore.getState().markQueryLimitReached();
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

export { handleQuerySubmissionError };
