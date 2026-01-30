import { useShallow } from "zustand/react/shallow";
import { UserDataStoreState, useUserDataStore } from "./userDataStore";

const useUserStore = <T>(sel: (s: UserDataStoreState) => T) =>
  useUserDataStore(useShallow((st) => sel(st)));

export default useUserStore;
