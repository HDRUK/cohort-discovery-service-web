import { useShallow } from "zustand/react/shallow";
import { DaphneStoreState, useDaphneStore } from "./useDaphneStore";

const useUserStore = <T>(sel: (qb: DaphneStoreState["userData"]) => T) =>
  useDaphneStore(useShallow((s) => sel(s.userData)));

export default useUserStore;
