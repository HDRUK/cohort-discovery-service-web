import { useSessionData } from "@/contexts/SessionDataContext";
import { useQueryLimitStore } from "@/store/queryLimitStore";
import { isQuotaExhausted } from "@/utils/user";

const useIsQueryLimitReached = (): boolean => {
  const { user } = useSessionData();
  const isLimitReached = useQueryLimitStore((s) => s.isQueryLimitReached);
  return isLimitReached || isQuotaExhausted(user);
};

export default useIsQueryLimitReached;
