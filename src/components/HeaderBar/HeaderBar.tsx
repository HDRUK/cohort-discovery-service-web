"use client";

import useHdrukChrome from "@/hooks/useHdrukChrome";
import HdrukHeader from "./HdrukHeaderBar";
import DefaultHeaderBar from "./DefaultHeaderBar";

export const HeaderBar = () => {
  const showHdrukChrome = useHdrukChrome();

  return showHdrukChrome ? <HdrukHeader /> : <DefaultHeaderBar />;
};
export default HeaderBar;
