"use client";

import { useDaphneStore } from "@/store/useDaphneStore";
import { Custodian } from "@/types/api";
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
    // note:
    // - temporary permissions
    // - we need a ticket to sort this out properly
    // - shouldnt be refering to external_custodian_id
    // - need to have something different in the token to make the comparision between
    const { token_user } = user;
    if (
      !token_user?.cohort_admin_teams
        .map((team) => team.id)
        .includes(custodian.external_custodian_id)
    ) {
      return forbidden();
    }
  }

  return children;
};

export default CustodianPage;
