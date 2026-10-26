import branding from "@branding/branding.config";
import useFeatures from "@/hooks/useFeatures";
import { useApplicationMode } from "@/providers/ApplicationModeProvider";

const useHdrukChrome = (): boolean => {
  const { hdrukTheme: hdrukThemeEnabled } = useFeatures();
  const { isStandalone } = useApplicationMode();

  return (
    hdrukThemeEnabled && (!isStandalone || branding.hdrukChromeInStandalone)
  );
};

export default useHdrukChrome;
