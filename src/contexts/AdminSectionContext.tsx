"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import { forbidden } from "next/navigation";

import useCustodianStore from "@/hooks/useCustodianStore";
import useUserStore from "@/hooks/useUserStore";
import { useAdminDataStore } from "@/store/adminDataStore";
import { checkIsAdmin } from "@/utils/user";
import { Collection, CollectionHost, User, Workgroup } from "@/types/api";

type Props = {
  collections: Collection[];
  collectionHosts: CollectionHost[];
  workgroups: Workgroup[];
  users: User[];
  children: React.ReactNode;
};

type AdminSectionValue = {
  isAdminSection: true;
};

const AdminSectionContext = createContext<AdminSectionValue | null>(null);

export const AdminSectionProvider = ({
  collections,
  collectionHosts,
  workgroups,
  users,
  children,
}: Props) => {
  const user = useUserStore((s) => s.user);

  const setCurrentCustodian = useCustodianStore((s) => s.current.setCustodian);
  const setCollectionHosts = useAdminDataStore((s) => s.setCollectionHosts);
  const setWorkgroups = useAdminDataStore((s) => s.setWorkgroups);
  const setCollections = useAdminDataStore((s) => s.setAllAprovedCollections);
  const setUsers = useAdminDataStore((s) => s.setUsers);

  const isAdmin = checkIsAdmin(user);
  if (user && !isAdmin) forbidden();

  useEffect(() => {
    setCurrentCustodian(null);
  }, [setCurrentCustodian]);

  useEffect(() => {
    setCollectionHosts(collectionHosts);
  }, [collectionHosts, setCollectionHosts]);

  useEffect(() => {
    setCollections(collections);
  }, [collections, setCollections]);

  useEffect(() => {
    setWorkgroups(workgroups);
  }, [workgroups, setWorkgroups]);

  useEffect(() => {
    setUsers(users);
  }, [users, setUsers]);

  const value = useMemo<AdminSectionValue>(
    () => ({ isAdminSection: true }),
    [],
  );

  return (
    <AdminSectionContext.Provider value={value}>
      {children}
    </AdminSectionContext.Provider>
  );
};

export const useIsAdminSection = () => {
  return useContext(AdminSectionContext) !== null;
};
