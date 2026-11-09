import { ApiError } from "@/lib/https";
import { NotifyFn } from "@/providers/NotifyProvider";
import { useUserDataStore } from "@/hooks/userDataStore";
import { routes } from "@/config/routes";
import { hardNavigate } from "@/utils/navigation";
import { DEFAULT_SESSION_EXPIRED_REDIRECT_DELAY_MS } from "@/config/defaults";

export const QUERY_LIMIT_REACHED_MESSAGE =
  "You've reached your monthly query limit. Try again next month.";

export const SESSION_EXPIRED_MESSAGE =
  "Your session has expired. Redirecting you to sign in again...";

const handleQuerySubmissionError = (
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
  if (error.code === 401) {
    notify({
      message: SESSION_EXPIRED_MESSAGE,
      severity: "error",
      autoHideDuration: null,
      anchorOrigin: { vertical: "top", horizontal: "center" },
    });
    // Full navigation, not router.push: the logout route handler has to run
    // to clear the cookie and redirect to the sign-in page. Delayed so the
    // user can read why they are being sent away.
    setTimeout(
      () => hardNavigate(routes.logout),
      DEFAULT_SESSION_EXPIRED_REDIRECT_DELAY_MS,
    );
    return;
  }
  throw new ApiError(error.code, error.text);
};

export { handleQuerySubmissionError };
