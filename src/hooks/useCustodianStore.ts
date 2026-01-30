import { useShallow } from "zustand/react/shallow";
import {
  CustodianDataStoreState,
  useCustodianDataStore,
} from "@/store/custodianDataStore";

const useCustodianStore = <T>(sel: (s: CustodianDataStoreState) => T) =>
  useCustodianDataStore(useShallow((st) => sel(st)));

export default useCustodianStore;
