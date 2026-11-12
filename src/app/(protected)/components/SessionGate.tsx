import { ReactNode } from "react";
import { forbidden, notFound } from "next/navigation";
import UserNotFound from "@/components/UserNotFound";
import { LoadedSession } from "@/server/loadSession";
import { isStandalone } from "@/utils/modes";
import ProtectedPage from "./ProtectedPage";
import SessionEnded from "./SessionEnded";
import { SessionAccess } from "./sessionAccess";

const applicationMode = process.env.APPLICATION_MODE;

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
      if (isStandalone(applicationMode)) notFound();
      return <UserNotFound />;
    case SessionAccess.Forbidden:
      forbidden();
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
