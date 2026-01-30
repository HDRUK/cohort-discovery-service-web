import { useShallow } from "zustand/react/shallow";
import { useFeatureFlagsStore } from "./featureFlagsStore";

const useFeatures = () => useFeatureFlagsStore(useShallow((st) => st.flags));

export default useFeatures;
