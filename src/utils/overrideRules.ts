import type { OptionsType } from "@/components/FormMultiSelect/FormMultiSelect";
import {
  FeatureOverride,
  FeatureOverrides,
  FeatureOverridesUpdate,
  OverrideRule,
  RuleSubject,
} from "@/types/features";

type RuleSubjects = Pick<OverrideRule, RuleSubject>;

const hasSubjects = ({ workgroups, users }: RuleSubjects) =>
  workgroups.length + users.length > 0;

const union = (current: number[], added: number[]) => [
  ...new Set([...current, ...added]),
];

export const toRules = ({
  users,
  workgroups,
}: FeatureOverrides): OverrideRule[] =>
  [true, false]
    .map((enabled) => ({
      enabled,
      workgroups: workgroups
        .filter((override) => override.enabled === enabled)
        .map(({ id }) => id),
      users: users
        .filter((override) => override.enabled === enabled)
        .map(({ id }) => id),
    }))
    .filter(hasSubjects);

export const toUpdate = (rules: OverrideRule[]): FeatureOverridesUpdate => ({
  users: rules.flatMap(({ enabled, users }) =>
    users.map((id) => ({ id, enabled })),
  ),
  workgroups: rules.flatMap(({ enabled, workgroups }) =>
    workgroups.map((id) => ({ id, enabled })),
  ),
});

export const addToRules = (
  rules: OverrideRule[],
  addition: OverrideRule,
): OverrideRule[] => {
  const existing = rules.find(({ enabled }) => enabled === addition.enabled);
  if (!existing) return [...rules, addition];
  return rules.map((rule) =>
    rule === existing
      ? {
          enabled: rule.enabled,
          workgroups: union(rule.workgroups, addition.workgroups),
          users: union(rule.users, addition.users),
        }
      : rule,
  );
};

export const replaceRule = (
  rules: OverrideRule[],
  enabled: boolean,
  subjects: RuleSubjects,
): OverrideRule[] =>
  rules.flatMap((rule) => {
    if (rule.enabled !== enabled) return [rule];
    const replaced = { enabled, ...subjects };
    return hasSubjects(replaced) ? [replaced] : [];
  });

export const removeRule = (
  rules: OverrideRule[],
  enabled: boolean,
): OverrideRule[] => rules.filter((rule) => rule.enabled !== enabled);

export const excludedIds = (
  rules: OverrideRule[],
  enabled: boolean,
  subject: RuleSubject,
): number[] => rules.find((rule) => rule.enabled !== enabled)?.[subject] ?? [];

export const userLabel = ({
  name,
  email,
}: {
  name: string;
  email?: string;
}): string => (email ? `${name} (${email})` : name);

export const withOverriddenSubjects = (
  options: OptionsType[],
  overrides: FeatureOverride[],
  label: (override: FeatureOverride) => string,
): OptionsType[] => [
  ...options,
  ...overrides
    .filter(({ id }) => !options.some(({ value }) => value === id))
    .map((override) => ({ value: override.id, label: label(override) })),
];

export const valueLabel = (enabled: boolean): string =>
  enabled ? "On" : "Off";

export const overrideCount = ({
  users,
  workgroups,
}: FeatureOverrides): number => users.length + workgroups.length;

export const overriddenHelp = (count: number): string =>
  `${count === 1 ? "1 override" : `${count} overrides`}: some workgroups or users have their own value for this flag. Changing the global value doesn't change theirs.`;
