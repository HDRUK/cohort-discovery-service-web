import {
  AccessPolicy,
  MembershipMode,
  MembershipSubject,
} from "@/types/accessPolicy";
import { User } from "@/types/api";

export interface MembershipEditability {
  mode: MembershipMode;
  editable: boolean;
  authoritative: boolean;
  providerLabels: string[];
}

export const joinLabels = (labels: string[]): string =>
  labels.length > 1
    ? `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`
    : (labels[0] ?? "your identity provider");

export const membershipEditability = (
  subject: MembershipSubject,
  policy: AccessPolicy,
  user?: User,
): MembershipEditability => {
  const deployment = policy[subject];
  const userSource = user?.membership_sources?.[subject];
  const mode = userSource?.mode ?? deployment.mode;
  const managed = mode !== MembershipMode.Internal;

  const slugs = userSource
    ? userSource.sources
    : managed
      ? Object.keys(policy.providers)
      : [];

  return {
    mode,
    editable: userSource?.editable ?? deployment.editable,
    authoritative: managed && deployment.authoritative,
    providerLabels: slugs.map((slug) => policy.providers[slug] ?? slug),
  };
};
