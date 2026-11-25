export const FEATURE_FLAG_GROUPS = [
  "Query builder",
  "Rule types",
  "Collections and BUNNY",
  "Users and access",
  "Other",
] as const;

export type FeatureFlagGroup = (typeof FEATURE_FLAG_GROUPS)[number];

interface FeatureFlagDetails {
  group: FeatureFlagGroup;
  description: string;
}

export const FEATURE_FLAG_DETAILS: Record<string, FeatureFlagDetails> = {
  "query-builder": {
    group: "Query builder",
    description:
      "Shows the rule builder on the New query page. When off, users see a message instead and can only use the free-text query input.",
  },
  "query-builder-use-leave-confirmation": {
    group: "Query builder",
    description:
      "Asks the user to confirm before leaving the query builder with rules in it.",
  },
  "query-builder-show-concept-stats": {
    group: "Query builder",
    description: "Shows record counts next to concepts in concept search.",
  },
  "query-builder-use-stats-in-ordering": {
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
    group: "Query builder",
    description: "Lets users put groups of rules inside other groups.",
  },
  "query-nlp": {
    group: "Query builder",
    description:
      "Shows the free-text search bar on the New query page. When off, users build queries from the rule builder only.",
  },
  "query-builder-use-value-as-number": {
    group: "Rule types",
    description: "Lets users add a numeric value to measurement rules.",
  },
  "query-builder-use-location": {
    group: "Rule types",
    description:
      "Lets users query by location. The API also rejects location queries from users who don't have it.",
  },
  "query-builder-use-death": {
    group: "Rule types",
    description:
      "Lets users query by death. The API also rejects death queries from users who don't have it.",
  },
  "query-builder-use-race": {
    group: "Rule types",
    description:
      "Shows race in the demographics panel. The API doesn't check it.",
  },
  "query-builder-use-demographic-rule": {
    group: "Rule types",
    description:
      "Lets users add demographics as rules in a query. Applied by the API when it builds the query.",
  },
  "constrain-for-bunny-v1": {
    group: "Collections and BUNNY",
    description:
      "Limits rules to what BUNNY v1 can run: an age or a time constraint on a rule, not both.",
  },
  "flatten-nested-groups": {
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
    group: "Collections and BUNNY",
    description: "Lets admins expand a collection to see more details.",
  },
  "query-rate-limit": {
    group: "Users and access",
    description:
      "Caps how many queries a user can run each month. On means the cap applies.",
  },
  "access-banner": {
    group: "Users and access",
    description:
      "Shows users without NHS SDE access a banner about the optional NHS Research SDE cohort.",
  },
  "in-app-messenger": {
    group: "Users and access",
    description: "Not used at the moment.",
  },
  "click-tracking-anonymous": {
    group: "Users and access",
    description: "Records clicks without saying which user made them.",
  },
};

export const featureFlagDetails = (feature: string): FeatureFlagDetails =>
  FEATURE_FLAG_DETAILS[feature] ?? { group: "Other", description: "" };
