import { DEFAULT_FLAGS, FeatureName } from "@/types/features";
import { useFeatureFlagsStore } from "@/store/featureFlagsStore";
import { useShallow } from "zustand/react/shallow";
import { useApplicationMode } from "@/providers/ApplicationModeProvider";

const useFeatures = () => {
  const { isStandalone } = useApplicationMode();
  return useFeatureFlagsStore(
    useShallow((st) => {
      const flags = { ...DEFAULT_FLAGS, ...(st.flags ?? {}) };

      return {
        queryBuilder: flags[FeatureName.QueryBuilder],
        queryBuilderLeaveConfirm: flags[FeatureName.QueryBuilderLeaveConfirm],
        queryBuilderShowConceptStats:
          flags[FeatureName.QueryBuilderShowConceptStats],
        queryBuilderStatsInOrdering:
          flags[FeatureName.QueryBuilderStatsInOrdering],

        constrainForBunnyV1: flags[FeatureName.ConstrainForBunnyV1],
        queryNlp: flags[FeatureName.QueryNlp],
        inAppMessenger: flags[FeatureName.InAppMessenger],

        syncWorkgroupsEveryRequest:
          flags[FeatureName.IntegratedSyncWorkgroupsEveryRequest],

        syncWorkgroupsFirstLogin:
          flags[FeatureName.IntegratedSyncWorkgroupsFirstLogin],

        ensureDefaultWorkgroups: flags[FeatureName.IntegratedEnsureDefaultWgs],

        syncSdeWorkgroupsFromClaim:
          flags[FeatureName.IntegratedSyncSdeWgsFromClaim],

        syncRolesEveryRequest:
          flags[FeatureName.IntegratedSyncRolesEveryRequest],

        syncCustodiansEveryRequest:
          flags[FeatureName.IntegratedSyncCustodiansEveryRequest],

        hdrukTheme: flags[FeatureName.HdrukTheme],
        manageWorkgroupsInternal:
          isStandalone || flags[FeatureName.ManageWorkgroupsInternally],
      };
    }),
  );
};

export default useFeatures;
