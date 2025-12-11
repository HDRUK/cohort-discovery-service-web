import { useShallow } from "zustand/react/shallow";
import { useDaphneStore } from "./useDaphneStore";
import { FeatureName } from "@/types/api";

type Features = {
  queryBuilder: boolean;
  constrainForBunnyV1: boolean;
  queryNlp: boolean;
  inAppMessenger: boolean;
};

type FeatureFlagsMap = Partial<Record<FeatureName, boolean>>;

const useFeatures = (): Features =>
  useDaphneStore(
    useShallow((s) => {
      const flags = (s.featureFlags.flags ?? {}) as FeatureFlagsMap;

      return {
        queryBuilder: !!flags[FeatureName.QueryBuilder],
        constrainForBunnyV1: !!flags[FeatureName.ConstrainForBunnyV1],
        queryNlp: !!flags[FeatureName.QueryNlp],
        inAppMessenger: !!flags[FeatureName.InAppMessenger],
      };
    })
  );

export default useFeatures;
