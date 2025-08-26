"use client";
import { useDaphneStore } from "@/store/useDaphneStore";
import { User } from "@/types/api";
import { forbidden } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface ProtectedPageProps {
  user: User;
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
