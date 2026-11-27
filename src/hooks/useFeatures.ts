import { DEFAULT_FLAGS } from "@/config/featureFlags";
import { useFeatureFlagsStore } from "@/store/featureFlagsStore";
import { useShallow } from "zustand/react/shallow";

const useFeatures = () => {
  return useFeatureFlagsStore(
    useShallow((st) => {
      const flags = { ...DEFAULT_FLAGS, ...(st.flags ?? {}) };

      return {
        queryBuilder: flags["query-builder"],
        queryBuilderLeaveConfirm: flags["query-builder-use-leave-confirmation"],
        queryBuilderShowConceptStats: flags["query-builder-show-concept-stats"],
        queryBuilderStatsInOrdering:
          flags["query-builder-use-stats-in-ordering"],

        constrainForBunnyV1: flags["constrain-for-bunny-v1"],
        queryBuilderAllowNestedGroups:
          flags["query-builder-allow-nested-groups"],
        flattenNestedGroups: flags["flatten-nested-groups"],
        queryNlp: flags["query-nlp"],
        inAppMessenger: flags["in-app-messenger"],

        syncWorkgroupsEveryRequest:
          flags["integrated-sync-workgroups-every-request"],

        syncWorkgroupsFirstLogin:
          flags["integrated-sync-workgroups-first-login"],

        ensureDefaultWorkgroups: flags["integrated-ensure-default-wgs"],

        syncSdeWorkgroupsFromClaim: flags["integrated-sync-sde-wgs-from-claim"],

        syncRolesEveryRequest: flags["integrated-sync-roles-every-request"],

        syncCustodiansEveryRequest:
          flags["integrated-sync-custodians-every-request"],

        hdrukTheme: flags["hdruk-uk-theme"],

        adminMoreCollectionDetails: flags["admin-more-collection-details"],

        queryBuilderUseValueAsNumber:
          flags["query-builder-use-value-as-number"],
        queryBuilderUseLocation: flags["query-builder-use-location"],
        queryBuilderUseDeath: flags["query-builder-use-death"],
        queryBuilderUseRace: flags["query-builder-use-race"],

        queryBuilderUseDemographicRule:
          flags["query-builder-use-demographic-rule"],

        accessBanner: flags["access-banner"],
      };
    }),
  );
};

export default useFeatures;
