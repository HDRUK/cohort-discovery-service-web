import { DEFAULT_FLAGS, FeatureName } from "@/types/features";
import { useFeatureFlagsStore } from "@/store/featureFlagsStore";
import { useShallow } from "zustand/react/shallow";

const useFeatures = () =>
  useFeatureFlagsStore(
    useShallow((st) => {
      const flags = { ...DEFAULT_FLAGS, ...(st.flags ?? {}) };

      return {
        queryBuilder: flags[FeatureName.QueryBuilder],
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

        showConceptStats: flags[FeatureName.ShowConceptStats],
      };
    }),
  );

export default useFeatures;
