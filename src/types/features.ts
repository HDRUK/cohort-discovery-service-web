export enum FeatureName {
  QueryBuilder = "query-builder",
  QueryBuilderLeaveConfirm = "query-builder-use-leave-confirmation",
  QueryBuilderShowConceptStats = "query-builder-show-concept-stats",
  QueryBuilderStatsInOrdering = "query-builder-use-stats-in-ordering",

  ConstrainForBunnyV1 = "constrain-for-bunny-v1",
  QueryNlp = "query-nlp",
  InAppMessenger = "in-app-messenger",
  ManageWorkgroupsInternally = "manage-workgroups-internally",

  IntegratedSyncWorkgroupsEveryRequest = "integrated-sync-workgroups-every-request",
  IntegratedSyncWorkgroupsFirstLogin = "integrated-sync-workgroups-first-login",
  IntegratedEnsureDefaultWgs = "integrated-ensure-default-wgs",
  IntegratedSyncSdeWgsFromClaim = "integrated-sync-sde-wgs-from-claim",
  IntegratedSyncRolesEveryRequest = "integrated-sync-roles-every-request",
  IntegratedSyncCustodiansEveryRequest = "integrated-sync-custodians-every-request",

  HdrukTheme = "hdruk-uk-theme",
}

export type FeatureFlag = Record<FeatureName, boolean>;

export const DEFAULT_FLAGS: FeatureFlag = {
  [FeatureName.QueryBuilder]: true,
  [FeatureName.QueryBuilderLeaveConfirm]: true,
  [FeatureName.QueryBuilderShowConceptStats]: false,
  [FeatureName.QueryBuilderStatsInOrdering]: true,

  [FeatureName.ConstrainForBunnyV1]: true,
  [FeatureName.QueryNlp]: true,
  [FeatureName.InAppMessenger]: false,

  [FeatureName.IntegratedSyncWorkgroupsEveryRequest]: false,
  [FeatureName.IntegratedSyncWorkgroupsFirstLogin]: true,
  [FeatureName.IntegratedEnsureDefaultWgs]: true,
  [FeatureName.IntegratedSyncSdeWgsFromClaim]: true,

  [FeatureName.IntegratedSyncRolesEveryRequest]: true,
  [FeatureName.IntegratedSyncCustodiansEveryRequest]: true,

  [FeatureName.HdrukTheme]: true,

  [FeatureName.ManageWorkgroupsInternally]: true,
};
