"use client";

import SkeletonFull from "@/components/SkeletonFull";
import { Custodian } from "@/types/api";
import { Paper } from "@mui/material";
import { forbidden } from "next/navigation";
import { useEffect } from "react";

import useUserStore from "@/hooks/useUserStore";
import useCustodianStore from "@/hooks/useCustodianStore";

const CustodianPage = ({
  custodian,
  children,
}: {
  custodian: Custodian;
  children: React.ReactNode;
}) => {
  const user = useUserStore((s) => s.user);
  const setCurrentCustodian = useCustodianStore((s) => s.setCurrentCustodian);

  useEffect(() => {
    setCurrentCustodian(custodian);
  }, [custodian, setCurrentCustodian]);

  if (user && custodian) {
    const { custodians } = user;
    if (!custodians.map((c) => c.pid).includes(custodian.pid)) {
      forbidden();
    }
    return children;
  }

  return (
    <Paper sx={{ display: "flex", height: "100%" }}>
      <SkeletonFull />
    </Paper>
  );
};

export default CustodianPage;
