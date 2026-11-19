import { useSessionData } from "@/contexts/SessionDataContext";
import useSearchParams from "@/hooks/useSearchParams";
import { Workgroup } from "@/types/api";
import { selectByIdOrFirst } from "@/utils/selection";

const useSelectedWorkgroup = (): Workgroup | null => {
  const { workgroups } = useSessionData();
  const { getSearchParam } = useSearchParams("workgroup_filter");
  return selectByIdOrFirst(workgroups, getSearchParam() ?? null);
};

export default useSelectedWorkgroup;
