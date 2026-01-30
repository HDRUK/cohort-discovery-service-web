import { useShallow } from "zustand/react/shallow";
import {
  StateManagementStoreState,
  useStateManagementStore,
} from "@/store/stateManagementStore";

const useStateManagement = <T>(sel: (s: StateManagementStoreState) => T) =>
  useStateManagementStore(useShallow((st) => sel(st)));

export default useStateManagement;
