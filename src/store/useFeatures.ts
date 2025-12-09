import { useShallow } from "zustand/react/shallow";
import { useDaphneStore } from "./useDaphneStore";

const useFeatures = () =>
  useDaphneStore(useShallow((s) => s.featureFlags.flags));

export default useFeatures;
