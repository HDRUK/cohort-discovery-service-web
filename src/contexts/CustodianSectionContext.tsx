"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import { redirect } from "next/navigation";
import { Paper } from "@mui/material";

import SkeletonFull from "@/components/SkeletonFull";
import useUserStore from "@/hooks/useUserStore";
import useCustodianStore from "@/hooks/useCustodianStore";
import type { CollectionHost, Custodian } from "@/types/api";

type Props = {
  custodian: Custodian;
  collectionHosts: CollectionHost[];
  children: React.ReactNode;
};

const CustodianSectionContext = createContext<Custodian | null>(null);

export function CustodianSectionProvider({
  custodian,
  collectionHosts,
  children,
}: Props) {
  const user = useUserStore((s) => s.user);

  const setCurrentCustodian = useCustodianStore((s) => s.current.setCustodian);
  const setCurrentCollectionHosts = useCustodianStore(
    (s) => s.current.setCollectionHosts,
  );

  useEffect(() => {
    setCurrentCustodian(custodian);
  }, [custodian, setCurrentCustodian]);

  useEffect(() => {
    setCurrentCollectionHosts(collectionHosts);
  }, [collectionHosts, setCurrentCollectionHosts]);

  const allowed = useMemo(() => {
    if (!user) return false; // unknown/loading
    const pids = user.custodians?.map((c) => c.pid) ?? [];
    return pids.includes(custodian.pid);
  }, [user, custodian.pid]);

  if (user && !allowed) {
    redirect("/403?reason=no-access-custodian");
  }

  if (!user) {
    return (
      <Paper sx={{ display: "flex", height: "100%" }}>
        <SkeletonFull />
      </Paper>
    );
  }

  return (
    <CustodianSectionContext.Provider value={custodian}>
      {children}
    </CustodianSectionContext.Provider>
  );
}

/**
 * Returns section info if you're in the custodian layout, otherwise null.
 * (This makes it safe for components reused elsewhere.)
 */
export function useCustodianSection() {
  return useContext(CustodianSectionContext);
}

/** Convenience boolean hook */
export function useIsCustodianSection() {
  return useContext(CustodianSectionContext) !== null;
}
