import "server-only";

import {
  decideAccess,
  SessionAccess,
} from "@/app/(protected)/components/sessionAccess";
import type { SessionData } from "@/contexts/SessionDataContext";
import { getUserCollections } from "@/server/data/collections";
import { getCustodians } from "@/server/data/custodians";
import { getFeatureFlags } from "@/server/data/features";
import { getCurrentUser } from "@/server/data/user";
import { getWorkgroups } from "@/server/data/workgroups";
import { getSession, hasLiveSession } from "@/server/session";
import { CombinedUser } from "@/types/api";
import { FeatureFlag } from "@/types/features";

export type LoadedSession =
  | { access: SessionAccess.Ok; data: SessionData; flags: FeatureFlag }
  | {
      access: Exclude<SessionAccess, SessionAccess.Ok>;
      errorText?: string;
      data: null;
    };

const ignoreRejection = () => undefined;

export const loadSession = async (): Promise<LoadedSession> => {
  const sessionReads = Promise.all([
    getFeatureFlags(),
    getCustodians(),
    getWorkgroups(),
    getUserCollections(),
  ]);
  sessionReads.catch(ignoreRejection);

  const [session, currentUser] = await Promise.all([
    getSession(),
    getCurrentUser(),
  ]);

  const access = decideAccess(currentUser);
  if (access !== SessionAccess.Ok) {
    return { access, errorText: currentUser.error?.text, data: null };
  }

  const [
    { data: flags },
    { data: custodians },
    { data: workgroups },
    { data: userCollections },
  ] = await sessionReads;

  return {
    access,
    flags,
    data: {
      user: {
        ...currentUser.data,
        token_user: session?.user ?? null,
      } as CombinedUser,
      userCollections,
      custodians,
      workgroups,
    },
  };
};

const signedOut = (): null => null;

export const loadSessionDataOrSignedOut =
  async (): Promise<SessionData | null> => {
    if (!(await hasLiveSession())) return null;
    return loadSession().then(({ data }) => data, signedOut);
  };
