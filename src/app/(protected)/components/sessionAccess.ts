import { ApiResponse, User } from "@/types/api";
import { RoleName } from "@/types/roles";

export enum SessionAccess {
  Ok = "ok",
  Forbidden = "forbidden",
  UserNotFound = "user-not-found",
  SessionEnded = "session-ended",
  Failed = "failed",
}

const ERROR_ACCESS: Record<number, SessionAccess> = {
  401: SessionAccess.SessionEnded,
  404: SessionAccess.UserNotFound,
};

const hasAccess = (me: User): boolean => {
  const roles = me.roles.map((r) => r.name);
  return (
    roles.includes(RoleName.USER) ||
    roles.includes(RoleName.ADMIN) ||
    me.custodians.length > 0
  );
};

export const decideAccess = ({
  data: me,
  error,
}: ApiResponse<User>): SessionAccess => {
  if (error) return ERROR_ACCESS[error.code] ?? SessionAccess.Failed;
  return hasAccess(me) ? SessionAccess.Ok : SessionAccess.Forbidden;
};
