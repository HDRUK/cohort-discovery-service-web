import { useSessionData } from "@/contexts/SessionDataContext";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import { hasSyntheticSelection } from "@/utils/user";

const useHasSelectedSyntheticDatasets = (): boolean => {
  const { userCollections } = useSessionData();
  const selectedDatasets = useQueryBuilder((qb) => qb.selectedDatasets);
  return hasSyntheticSelection(selectedDatasets, userCollections);
};

export default useHasSelectedSyntheticDatasets;
