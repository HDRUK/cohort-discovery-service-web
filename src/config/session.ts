import { SessionAccess } from "@/types/session";

export const SESSION_ENDED_STATUS = 401;
export const USER_NOT_FOUND_STATUS = 404;

export const SESSION_ACCESS_BY_STATUS: Record<number, SessionAccess> = {
  [SESSION_ENDED_STATUS]: SessionAccess.SessionEnded,
  [USER_NOT_FOUND_STATUS]: SessionAccess.UserNotFound,
};
