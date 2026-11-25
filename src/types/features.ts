export enum FeatureName {
  QueryBuilder = "query-builder",
  QueryBuilderLeaveConfirm = "query-builder-use-leave-confirmation",
  QueryBuilderShowConceptStats = "query-builder-show-concept-stats",
  QueryBuilderStatsInOrdering = "query-builder-use-stats-in-ordering",

  ConstrainForBunnyV1 = "constrain-for-bunny-v1",
  QueryBuilderAllowNestedGroups = "query-builder-allow-nested-groups",
  FlattenNestedGroups = "flatten-nested-groups",
  QueryNlp = "query-nlp",
  InAppMessenger = "in-app-messenger",

  IntegratedSyncWorkgroupsEveryRequest = "integrated-sync-workgroups-every-request",
  IntegratedSyncWorkgroupsFirstLogin = "integrated-sync-workgroups-first-login",
  IntegratedEnsureDefaultWgs = "integrated-ensure-default-wgs",
  IntegratedSyncSdeWgsFromClaim = "integrated-sync-sde-wgs-from-claim",
  IntegratedSyncRolesEveryRequest = "integrated-sync-roles-every-request",
  IntegratedSyncCustodiansEveryRequest = "integrated-sync-custodians-every-request",

  HdrukTheme = "hdruk-uk-theme",

  AdminMoreCollectionDetails = "admin-more-collection-details",

  QueryBuilderUseValueAsNumber = "query-builder-use-value-as-number",
  QueryBuilderUseLocation = "query-builder-use-location",
  QueryBuilderUseDeath = "query-builder-use-death",
  QueryBuilderUseRace = "query-builder-use-race",

  QueryBuilderUseDemographicRule = "query-builder-use-demographic-rule",

  AccessBanner = "access-banner",
}

export type FeatureFlag = Record<FeatureName, boolean>;

export const DEFAULT_FLAGS: FeatureFlag = {
  [FeatureName.QueryBuilder]: true,
  [FeatureName.QueryBuilderLeaveConfirm]: true,
  [FeatureName.QueryBuilderShowConceptStats]: false,
  [FeatureName.QueryBuilderStatsInOrdering]: true,

  [FeatureName.ConstrainForBunnyV1]: true,
  [FeatureName.QueryBuilderAllowNestedGroups]: false,
  [FeatureName.FlattenNestedGroups]: false,
  [FeatureName.QueryNlp]: true,
  [FeatureName.InAppMessenger]: false,

  [FeatureName.IntegratedSyncWorkgroupsEveryRequest]: false,
  [FeatureName.IntegratedSyncWorkgroupsFirstLogin]: true,
  [FeatureName.IntegratedEnsureDefaultWgs]: true,
  [FeatureName.IntegratedSyncSdeWgsFromClaim]: true,

  [FeatureName.IntegratedSyncRolesEveryRequest]: true,
  [FeatureName.IntegratedSyncCustodiansEveryRequest]: true,

  [FeatureName.HdrukTheme]: true,

  [FeatureName.AdminMoreCollectionDetails]: false,

  [FeatureName.QueryBuilderUseValueAsNumber]: false,
  [FeatureName.QueryBuilderUseLocation]: false,
  [FeatureName.QueryBuilderUseDeath]: false,
  [FeatureName.QueryBuilderUseRace]: true,

  [FeatureName.QueryBuilderUseDemographicRule]: false,

  [FeatureName.AccessBanner]: false,
};

export interface FeatureOverride {
  id: number;
  name: string;
  email?: string;
  enabled: boolean;
}

export interface FeatureOverrides {
  feature: string;
  global: boolean;
  overridable?: boolean;
  users: FeatureOverride[];
  workgroups: FeatureOverride[];
}

export interface FeatureOverrideUpdate {
  id: number;
  enabled: boolean;
}

export interface FeatureOverridesUpdate {
  users: FeatureOverrideUpdate[];
  workgroups: FeatureOverrideUpdate[];
}
