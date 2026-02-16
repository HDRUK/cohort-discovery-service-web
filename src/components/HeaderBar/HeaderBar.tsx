"use client";

import useFeatures from "@/hooks/useFeatures";
import HdrukHeader from "./HdrukHeaderBar";
import DefaultHeaderBar from "./DefaultHeaderBar";

type HeaderBarProps = { standalone: boolean };
export const HeaderBar = ({ standalone }: HeaderBarProps) => {
  const { hdrukTheme: hdrukThemeEnabled } = useFeatures();

  return hdrukThemeEnabled ? (
    <HdrukHeader />
  ) : (
    <DefaultHeaderBar standalone={standalone} />
  );
};
export default HeaderBar;
