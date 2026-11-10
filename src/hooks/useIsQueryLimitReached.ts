import { useSessionData } from "@/contexts/SessionDataContext";
import { isQuotaExhausted } from "@/utils/user";

const useIsQueryLimitReached = (): boolean => {
  const { user } = useSessionData();
  return isQuotaExhausted(user);
};

export default useIsQueryLimitReached;
