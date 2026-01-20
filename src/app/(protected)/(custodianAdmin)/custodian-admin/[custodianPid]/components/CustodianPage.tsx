"use client";

import SkeletonFull from "@/components/SkeletonFull";
import { useDaphneStore } from "@/store/useDaphneStore";
import { Custodian } from "@/types/api";
import { Paper } from "@mui/material";
import { forbidden } from "next/navigation";
import { useEffect } from "react";

const CustodianPage = ({
  custodian,
  children,
}: {
  custodian: Custodian;
  children: React.ReactNode;
}) => {
  const {
    userData: { user },
    custodianData: { setCurrentCustodian },
  } = useDaphneStore();

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
