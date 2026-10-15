import { ApiError } from "@/lib/https";
import { NotifyFn } from "@/providers/NotifyProvider";

const handleQueryRateLimitError = (
  error: { code: number; text: string },
  notify: NotifyFn,
): void => {
  if (error.code === 429) {
    notify({
      message: "You've reached your monthly query limit. Try again next month.",
      severity: "error",
      autoHideDuration: null,
      anchorOrigin: { vertical: "top", horizontal: "center" },
    });
    return;
  }
  throw new ApiError(error.code, error.text);
};

export { handleQueryRateLimitError };
