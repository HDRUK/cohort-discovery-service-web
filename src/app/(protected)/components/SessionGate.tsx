import { ReactNode } from "react";
import Custom403 from "@/app/(error)/403/components/Custom403";
import UserNotFound from "@/components/UserNotFound";
import { LoadedSession } from "@/server/loadSession";
import ProtectedPage from "./ProtectedPage";
import SessionEnded from "./SessionEnded";
import { SessionAccess } from "@/types/session";

const SessionGate = async ({
  session,
  children,
}: {
  session: Promise<LoadedSession>;
  children: ReactNode;
}) => {
  const loaded = await session;

  switch (loaded.access) {
    case SessionAccess.SessionEnded:
      return <SessionEnded />;
    case SessionAccess.UserNotFound:
      return <UserNotFound />;
    case SessionAccess.Forbidden:
      return <Custom403 reason="missing-role" />;
    case SessionAccess.Failed:
      throw new Error(loaded.errorText);
  }

  return (
    <ProtectedPage
      featureFlags={loaded.flags}
      sessionMsRemaining={loaded.sessionMsRemaining}
    >
      {children}
    </ProtectedPage>
  );
};

export default SessionGate;
