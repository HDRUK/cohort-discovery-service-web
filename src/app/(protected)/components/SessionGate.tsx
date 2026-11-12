import { ReactNode } from "react";
import { forbidden, notFound } from "next/navigation";
import { CombinedUser } from "@/types/api";
import UserNotFound from "@/components/UserNotFound";
import { getCurrentUser } from "@/server/data/user";
import { getCustodians } from "@/server/data/custodians";
import { getFeatureFlags } from "@/server/data/features";
import { getWorkgroups } from "@/server/data/workgroups";
import { getUserCollections } from "@/server/data/collections";
import { getSession } from "@/server/session";
import { isStandalone } from "@/utils/modes";
import ProtectedPage from "./ProtectedPage";
import SessionEnded from "./SessionEnded";
import { decideAccess, SessionAccess } from "./sessionAccess";

const applicationMode = process.env.APPLICATION_MODE;

const SessionGate = async ({ children }: { children: ReactNode }) => {
  const [session, currentUser] = await Promise.all([
    getSession(),
    getCurrentUser(),
  ]);

  switch (decideAccess(currentUser)) {
    case SessionAccess.SessionEnded:
      return <SessionEnded />;
    case SessionAccess.UserNotFound:
      if (isStandalone(applicationMode)) notFound();
      return <UserNotFound />;
    case SessionAccess.Forbidden:
      forbidden();
    case SessionAccess.Failed:
      throw new Error(currentUser.error?.text);
  }

  const [
    { data: flags },
    { data: custodians },
    { data: workgroups },
    { data: collections },
  ] = await Promise.all([
    getFeatureFlags(),
    getCustodians(),
    getWorkgroups(),
    getUserCollections(),
  ]);

  const user = {
    ...currentUser.data,
    token_user: session?.user ?? null,
  } as CombinedUser;

  return (
    <ProtectedPage
      user={user}
      collections={collections}
      custodians={custodians}
      workgroups={workgroups}
      featureFlags={flags}
    >
      {children}
    </ProtectedPage>
  );
};

export default SessionGate;
