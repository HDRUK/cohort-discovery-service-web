import { MEMBERSHIP_SUBJECT_LABELS } from "@/config/accessPolicy";
import {
  AccessPolicy,
  MembershipEditFailure,
  MembershipMode,
  MembershipSubject,
  RestoredEntry,
  RestoredWhen,
} from "@/types/accessPolicy";
import { User } from "@/types/api";
import { capitaliseFirstLetter } from "@/utils/string";

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

export const restoredOnSync = (
  subject: MembershipSubject,
  policy: AccessPolicy,
  user: User,
  entryId: number,
): RestoredEntry | null => {
  const { mode } = membershipEditability(subject, policy, user);
  if (mode === MembershipMode.Internal) return null;

  return (
    policy[subject].restored_on_sync.find((entry) => entry.id === entryId) ??
    null
  );
};

interface NoticeParts {
  subjectLabel: string;
  providers: string;
  plural: boolean;
  authoritative: boolean;
}

const NOTICES: Record<MembershipMode, (parts: NoticeParts) => string | null> = {
  [MembershipMode.Internal]: () => null,
  [MembershipMode.Authoritative]: ({ subjectLabel, providers }) =>
    `${capitaliseFirstLetter(subjectLabel)} are managed by ${providers}. Changes made there apply the next time this user signs in.`,
  [MembershipMode.Additive]: ({ subjectLabel, providers, plural }) =>
    `${providers} ${plural ? "add" : "adds"} ${subjectLabel} at each sign-in. Removing one ${plural ? "they provide" : "it provides"} is undone the next time this user signs in.`,
  [MembershipMode.FirstLogin]: ({ subjectLabel, providers, authoritative }) =>
    authoritative
      ? `${providers} will replace these ${subjectLabel} when this user first signs in.`
      : `${providers} will add ${subjectLabel} when this user first signs in.`,
};

export const membershipNotice = (
  subject: MembershipSubject,
  { mode, authoritative, providerLabels }: MembershipEditability,
): string | null =>
  NOTICES[mode]({
    subjectLabel: MEMBERSHIP_SUBJECT_LABELS[subject],
    providers: joinLabels(providerLabels),
    plural: providerLabels.length > 1,
    authoritative,
  });

export const workgroupRemovalWarning = (
  policy: AccessPolicy,
  user: User,
  workgroupId: number,
): string | null => {
  const subject = MembershipSubject.Workgroups;
  const { mode, providerLabels } = membershipEditability(subject, policy, user);
  if (mode === MembershipMode.Internal) return null;

  const providers = joinLabels(providerLabels);
  const restored = restoredOnSync(subject, policy, user, workgroupId);

  if (restored?.when === RestoredWhen.EverySync)
    return `${restored.name} will be restored the next time ${user.name} signs in through ${providers}.`;
  if (restored?.when === RestoredWhen.SdeApproved)
    return `${restored.name} may be restored the next time ${user.name} signs in, if they are SDE-approved.`;

  const provides = providerLabels.length > 1 ? "provide" : "provides";

  return mode === MembershipMode.FirstLogin
    ? `${user.name} will be added back when they first sign in if ${providers} ${provides} this workgroup.`
    : `${user.name} will be added back the next time they sign in if ${providers} still ${provides} this workgroup.`;
};

export interface MembershipStatus {
  label: string;
  notice: string;
  editable: boolean;
}

export const membershipStatus = (
  subject: MembershipSubject,
  policy: AccessPolicy,
  user: User,
): MembershipStatus | null => {
  const editability = membershipEditability(subject, policy, user);
  const notice = membershipNotice(subject, editability);
  if (!notice) return null;

  const providers = joinLabels(editability.providerLabels);

  return {
    label: editability.editable
      ? `Synced from ${providers}`
      : `Managed by ${providers}`,
    notice,
    editable: editability.editable,
  };
};

const withFullStop = (text: string): string =>
  /[.!?]$/.test(text) ? text : `${text}.`;

interface Named {
  id: number;
  name: string;
}

export const describeMembershipFailures = (
  failed: MembershipEditFailure[],
  named: Named[],
): string =>
  failed
    .map(({ id, message }) => {
      const name = named.find((item) => item.id === id)?.name ?? `item ${id}`;
      return withFullStop(`Couldn't update ${name}: ${message}`);
    })
    .join(" ");

export const selectedManagedUsers = (
  policy: AccessPolicy,
  users: User[],
  selectedIds: string[],
): User[] =>
  users.filter(
    (user) =>
      selectedIds.includes(String(user.id)) &&
      !membershipEditability(MembershipSubject.Workgroups, policy, user)
        .editable,
  );

export const managedUsersWarning = (
  policy: AccessPolicy,
  managedUsers: User[],
): string | null => {
  if (!managedUsers.length) return null;

  const labels = [
    ...new Set(
      managedUsers.flatMap(
        (user) =>
          membershipEditability(MembershipSubject.Workgroups, policy, user)
            .providerLabels,
      ),
    ),
  ];
  const providers = joinLabels(labels);
  const names = joinLabels(managedUsers.map((user) => user.name));
  const replace = labels.length > 1 ? "replace" : "replaces";

  return `Workgroups for ${names} are managed by ${providers}, which ${replace} them every time they sign in, so they can't be changed here. Change them in ${providers} instead.`;
};

export interface WorkgroupUserOption {
  value: number;
  label: string;
  disabled: boolean;
}

export const workgroupUserOptions = (
  users: User[],
  policy: AccessPolicy | null,
): WorkgroupUserOption[] =>
  users.map((user) => {
    const status = policy
      ? membershipStatus(MembershipSubject.Workgroups, policy, user)
      : null;
    const managed = !!status && !status.editable;

    return {
      value: user.id,
      label: `${user.name} (${user.email})${managed ? ` — ${status.label}` : ""}`,
      disabled: managed,
    };
  });

export const firstLoginReplacementNotices = (
  users: User[],
  policy: AccessPolicy,
  selectedIds: number[],
): string[] =>
  users
    .filter((user) => selectedIds.includes(user.id))
    .flatMap((user) => {
      const editability = membershipEditability(
        MembershipSubject.Workgroups,
        policy,
        user,
      );
      const replacedAtFirstLogin =
        editability.mode === MembershipMode.FirstLogin &&
        editability.authoritative;
      const notice = membershipNotice(
        MembershipSubject.Workgroups,
        editability,
      );

      return replacedAtFirstLogin && notice ? [`${user.name}: ${notice}`] : [];
    });

export const removalSummary = (
  total: number,
  failed: MembershipEditFailure[],
  users: User[],
  workgroupName: string,
): string => {
  const removed = total - failed.length;
  const count = failed.length
    ? `${removed} of ${total} users`
    : `${total} user${total > 1 ? "s" : ""}`;
  const summary = `${count} removed from workgroup ${workgroupName}.`;

  return failed.length
    ? `${summary} ${describeMembershipFailures(failed, users)}`
    : summary;
};
