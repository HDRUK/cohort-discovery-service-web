import { useShallow } from "zustand/react/shallow";
import { DaphneStoreState, useDaphneStore } from "./useDaphneStore";

const useQueryBuilder = <T>(sel: (qb: DaphneStoreState["queryBuilder"]) => T) =>
  useDaphneStore(useShallow((s) => sel(s.queryBuilder)));

export default useQueryBuilder;
