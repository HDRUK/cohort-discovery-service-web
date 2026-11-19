"use client";

import { createContext, ReactNode, useContext } from "react";
import { Network } from "@/types/api";

const NO_NETWORKS: Network[] = [];

const NetworksContext = createContext<Network[]>(NO_NETWORKS);

export const NetworksProvider = ({
  networks,
  children,
}: {
  networks: Network[];
  children: ReactNode;
}) => (
  <NetworksContext.Provider value={networks}>
    {children}
  </NetworksContext.Provider>
);

export const useNetworks = (): Network[] => useContext(NetworksContext);
