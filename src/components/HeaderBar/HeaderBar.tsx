"use client";

import useFeatures from "@/hooks/useFeatures";
import { useApplicationMode } from "@/providers/ApplicationModeProvider";
import HdrukHeader from "./HdrukHeaderBar";
import DefaultHeaderBar from "./DefaultHeaderBar";

export const HeaderBar = () => {
  const { hdrukTheme: hdrukThemeEnabled } = useFeatures();
  const { isStandalone } = useApplicationMode();

  return hdrukThemeEnabled && !isStandalone ? (
    <HdrukHeader />
  ) : (
    <DefaultHeaderBar />
  );
};
export default HeaderBar;
