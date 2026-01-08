import { useShallow } from "zustand/react/shallow";
import { DaphneStoreState, useDaphneStore } from "./useDaphneStore";

const useCustodianStore = <T>(
  sel: (qb: DaphneStoreState["custodianData"]) => T
) => useDaphneStore(useShallow((s) => sel(s.custodianData)));

export default useCustodianStore;
