import { DEFAULT_FLAGS, FeatureName } from "@/types/api";
import { useFeatureFlagsStore } from "@/store/featureFlagsStore";
import { useShallow } from "zustand/react/shallow";

const useFeatures = () =>
  useFeatureFlagsStore(
    useShallow((st) => {
      const flags = st.flags ?? DEFAULT_FLAGS;
      return {
        queryBuilder: flags[FeatureName.QueryBuilder] ?? false,
        constrainForBunnyV1: flags[FeatureName.ConstrainForBunnyV1] ?? false,
        queryNlp: flags[FeatureName.QueryNlp] ?? false,
        inAppMessenger: flags[FeatureName.InAppMessenger] ?? false,
      };
    }),
  );

export default useFeatures;
