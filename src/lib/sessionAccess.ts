import {
  SESSION_ACCESS_BY_STATUS,
  SESSION_ENDED_STATUS,
} from "@/config/session";
import { ApiResponse, User } from "@/types/api";
import { RoleName } from "@/types/roles";
import { SessionAccess } from "@/types/session";

export const isSessionEnded = (status: number): boolean =>
  status === SESSION_ENDED_STATUS;

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
  if (error)
    return SESSION_ACCESS_BY_STATUS[error.code] ?? SessionAccess.Failed;
  return hasAccess(me) ? SessionAccess.Ok : SessionAccess.Forbidden;
};
