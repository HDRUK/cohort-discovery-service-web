"use client";

import useFeatures from "@/hooks/useFeatures";
import HdrukHeader from "./HdrukHeaderBar";
import DefaultHeaderBar from "./DefaultHeaderBar";

export const HeaderBar = () => {
  const { hdrukTheme: hdrukThemeEnabled } = useFeatures();

  return hdrukThemeEnabled ? <HdrukHeader /> : <DefaultHeaderBar />;
};
export default HeaderBar;
