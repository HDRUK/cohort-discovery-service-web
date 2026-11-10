import { useSessionData } from "@/contexts/SessionDataContext";
import useUserStore from "@/hooks/useUserStore";
import { isQuotaExhausted } from "@/utils/user";

const useIsQueryLimitReached = (): boolean => {
  const { user } = useSessionData();
  const isLimitReached = useUserStore((s) => s.isQueryLimitReached);
  return isLimitReached || isQuotaExhausted(user);
};

export default useIsQueryLimitReached;
