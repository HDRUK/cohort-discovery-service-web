import { useShallow } from "zustand/react/shallow";
import {
  QueryBuilderStoreState,
  useQueryBuilderStore,
} from "@/store/queryBuilderStore";

const useQueryBuilder = <T>(sel: (qb: QueryBuilderStoreState) => T) =>
  useQueryBuilderStore(useShallow((s) => sel(s)));

export default useQueryBuilder;
