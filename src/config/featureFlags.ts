import type { FeatureFlag } from "@/types/features";

export const FEATURE_FLAG_GROUPS = [
  "Query builder",
  "Rule types",
  "Collections and BUNNY",
  "Users and access",
  "Other",
] as const;

export type FeatureFlagGroup = (typeof FEATURE_FLAG_GROUPS)[number];

interface FeatureFlagDefinition {
  group: FeatureFlagGroup;
  description: string;
  default?: boolean;
}

export const GLOBAL_ONLY_HELP = "Global only: this flag can't be overridden.";

export const FEATURE_FLAGS = {
  "query-builder": {
    default: true,
    group: "Query builder",
    description:
      "Shows the rule builder on the New query page. When off, users see a message instead and can only use the free-text query input.",
  },
  "query-builder-use-leave-confirmation": {
    default: true,
    group: "Query builder",
    description:
      "Asks the user to confirm before leaving the query builder with rules in it.",
  },
  "query-builder-show-concept-stats": {
    default: false,
    group: "Query builder",
    description: "Shows record counts next to concepts in concept search.",
  },
  "query-builder-use-stats-in-ordering": {
    default: true,
    group: "Query builder",
    description:
      "Orders concept search and text-to-rule results by how often concepts occur in the collections. Applied by the API.",
  },
  "query-builder-use-collections-in-search": {
    group: "Query builder",
    description:
      "Limits concept search and text-to-rule results to concepts found in the selected collections. Applied by the API.",
  },
  "query-builder-allow-nested-groups": {
    default: false,
    group: "Query builder",
    description: "Lets users put groups of rules inside other groups.",
  },
  "query-nlp": {
    default: true,
    group: "Query builder",
    description:
      "Shows the free-text search bar on the New query page. When off, users build queries from the rule builder only.",
  },
  "query-builder-use-value-as-number": {
    default: false,
    group: "Rule types",
    description: "Lets users add a numeric value to measurement rules.",
  },
  "query-builder-use-location": {
    default: false,
    group: "Rule types",
    description:
      "Lets users query by location. The API also rejects location queries from users who don't have it.",
  },
  "query-builder-use-death": {
    default: false,
    group: "Rule types",
    description:
      "Lets users query by death. The API also rejects death queries from users who don't have it.",
  },
  "query-builder-use-race": {
    default: true,
    group: "Rule types",
    description:
      "Shows race in the demographics panel. The API doesn't check it.",
  },
  "query-builder-use-demographic-rule": {
    default: false,
    group: "Rule types",
    description:
      "Lets users add demographics as rules in a query. Applied by the API when it builds the query.",
  },
  "constrain-for-bunny-v1": {
    default: true,
    group: "Collections and BUNNY",
    description:
      "Limits rules to what BUNNY v1 can run: an age or a time constraint on a rule, not both.",
  },
  "flatten-nested-groups": {
    default: false,
    group: "Collections and BUNNY",
    description: "Flattens nested groups in queries before they reach BUNNY.",
  },
  "collection-task-backlog-limit": {
    group: "Collections and BUNNY",
    description: "Limits how many tasks can queue up for one collection.",
  },
  "distribution-use-central-domain": {
    group: "Collections and BUNNY",
    description:
      "Takes each concept's domain from the central vocabulary instead of the one a collection reports.",
  },
  "admin-more-collection-details": {
    default: false,
    group: "Collections and BUNNY",
    description: "Lets admins expand a collection to see more details.",
  },
  "query-rate-limit": {
    group: "Users and access",
    description:
      "Caps how many queries a user can run each month. On means the cap applies.",
  },
  "access-banner": {
    default: false,
    group: "Users and access",
    description:
      "Shows users without NHS SDE access a banner about the optional NHS Research SDE cohort.",
  },
  "in-app-messenger": {
    default: false,
    group: "Users and access",
    description: "Not used at the moment.",
  },
  "hdruk-uk-theme": {
    default: true,
    group: "Users and access",
    description:
      "Shows HDR UK branding in the header, footer and support pop-out.",
  },
  "integrated-sync-workgroups-every-request": {
    default: false,
    group: "Users and access",
    description:
      "Integrated mode: syncs a user's workgroups from the Gateway on every request.",
  },
  "integrated-sync-workgroups-first-login": {
    default: true,
    group: "Users and access",
    description:
      "Integrated mode: syncs a user's workgroups from the Gateway the first time they sign in.",
  },
  "integrated-ensure-default-wgs": {
    default: true,
    group: "Users and access",
    description:
      "Integrated mode: makes sure each user is in the default workgroups.",
  },
  "integrated-sync-sde-wgs-from-claim": {
    default: true,
    group: "Users and access",
    description:
      "Integrated mode: sets a user's SDE workgroups from their sign-in claim.",
  },
  "integrated-sync-roles-every-request": {
    default: true,
    group: "Users and access",
    description:
      "Integrated mode: syncs a user's roles from the Gateway on every request.",
  },
  "integrated-sync-custodians-every-request": {
    default: true,
    group: "Users and access",
    description:
      "Integrated mode: syncs a user's custodians from the Gateway on every request.",
  },
  "click-tracking-anonymous": {
    group: "Users and access",
    description: "Records clicks without saying which user made them.",
  },
} as const satisfies Record<string, FeatureFlagDefinition>;

type FeatureFlagName = keyof typeof FEATURE_FLAGS;

export const featureFlagDetails = (
  feature: string,
): Pick<FeatureFlagDefinition, "group" | "description"> =>
  FEATURE_FLAGS[feature as FeatureFlagName] ?? {
    group: "Other",
    description: "",
  };

export const DEFAULT_FLAGS = Object.fromEntries(
  Object.entries<FeatureFlagDefinition>(FEATURE_FLAGS)
    .filter(([, { default: value }]) => value !== undefined)
    .map(([name, { default: value }]) => [name, value]),
) as FeatureFlag;
