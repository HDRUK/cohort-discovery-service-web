import { ApiError } from "@/lib/https";
import { isSessionEnded } from "@/lib/sessionAccess";
import { useSessionStore } from "@/store/sessionStore";

export const endSessionIfUnauthorised = (error: unknown): boolean => {
  if (!(error instanceof ApiError) || !isSessionEnded(error.status))
    return false;
  useSessionStore.getState().endSession();
  return true;
};
