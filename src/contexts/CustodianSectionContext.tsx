"use client";

import { createContext, ReactNode, use, useContext, useMemo } from "react";

import type { ApiResponse, CollectionHost, Custodian } from "@/types/api";

export interface CustodianSectionData {
  custodian: Custodian;
  collectionHosts: CollectionHost[];
}

type Props = {
  custodian: Promise<ApiResponse<Custodian>>;
  collectionHosts: Promise<ApiResponse<CollectionHost[]>>;
  children: ReactNode;
};

const CustodianSectionContext = createContext<CustodianSectionData | null>(
  null,
);

export const CustodianSectionDataProvider = ({
  value,
  children,
}: {
  value: CustodianSectionData;
  children: ReactNode;
}) => (
  <CustodianSectionContext.Provider value={value}>
    {children}
  </CustodianSectionContext.Provider>
);

export function CustodianSectionProvider({
  custodian: custodianPromise,
  collectionHosts: collectionHostsPromise,
  children,
}: Props) {
  const { data: custodian } = use(custodianPromise);
  const { data: collectionHosts } = use(collectionHostsPromise);

  const value = useMemo<CustodianSectionData>(
    () => ({ custodian, collectionHosts }),
    [custodian, collectionHosts],
  );

  return (
    <CustodianSectionDataProvider value={value}>
      {children}
    </CustodianSectionDataProvider>
  );
}

/**
 * Returns section info if you're in the custodian layout, otherwise null.
 * (This makes it safe for components reused elsewhere.)
 */
export function useCustodianSection(): Custodian | null {
  return useContext(CustodianSectionContext)?.custodian ?? null;
}

export function useCustodianSectionHosts(): CollectionHost[] | null {
  return useContext(CustodianSectionContext)?.collectionHosts ?? null;
}

/** Convenience boolean hook */
export function useIsCustodianSection() {
  return useContext(CustodianSectionContext) !== null;
}
