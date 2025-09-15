"use client";
import { useDaphneStore } from "@/store/useDaphneStore";
import { CombinedUser, Custodian } from "@/types/api";
import { forbidden } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface ProtectedPageProps {
  user: CombinedUser;
  custodians: Custodian[];
  children: ReactNode;
}

const ProtectedPage = ({ user, custodians, children }: ProtectedPageProps) => {
  const {
    userData: { setUser },
    custodianData: { setCustodians },
  } = useDaphneStore();

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  useEffect(() => {
    setCustodians(custodians);
  }, [custodians, setCustodians]);

  if (!user) {
    forbidden();
  }

  return <>{children} </>;
};

export default ProtectedPage;
