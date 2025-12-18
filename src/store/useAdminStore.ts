import { useShallow } from "zustand/react/shallow";
import { DaphneStoreState, useDaphneStore } from "./useDaphneStore";

const useAdminStore = <T>(sel: (qb: DaphneStoreState["adminData"]) => T) =>
  useDaphneStore(useShallow((s) => sel(s.adminData)));

export default useAdminStore;
