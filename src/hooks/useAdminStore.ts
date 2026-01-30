import { useShallow } from "zustand/react/shallow";
import { AdminDataStoreState, useAdminDataStore } from "@/store/adminDataStore";

const useAdminStore = <T>(sel: (s: AdminDataStoreState) => T) =>
  useAdminDataStore(useShallow((st) => sel(st)));

export default useAdminStore;
