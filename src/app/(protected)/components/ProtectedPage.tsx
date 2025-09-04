"use client";
import { useDaphneStore } from "@/store/useDaphneStore";
import { CombinedUser } from "@/types/api";
import { forbidden } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface ProtectedPageProps {
  user: CombinedUser;
  children: ReactNode;
}

const ProtectedPage = ({ user, children }: ProtectedPageProps) => {
  const {
    userData: { setUser },
  } = useDaphneStore();

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  if (!user) {
    forbidden();
  }

  return <>{children} </>;
};

export default ProtectedPage;
