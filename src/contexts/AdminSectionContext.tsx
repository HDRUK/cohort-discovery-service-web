"use client";

import { createContext, use, useContext, useEffect, useMemo } from "react";
import { redirect } from "next/navigation";

import useCustodianStore from "@/hooks/useCustodianStore";
import { useAdminDataStore } from "@/store/adminDataStore";
import { checkIsAdmin } from "@/utils/user";
import { ApiResponse, Collection, CollectionHost, User } from "@/types/api";
import { useSessionData } from "@/contexts/SessionDataContext";

type Props = {
  collections: Promise<ApiResponse<Collection[]>>;
  collectionHosts: Promise<ApiResponse<CollectionHost[]>>;
  users: Promise<ApiResponse<User[]>>;
  children: React.ReactNode;
};

type AdminSectionValue = {
  isAdminSection: true;
};

const AdminSectionContext = createContext<AdminSectionValue | null>(null);

export const AdminSectionProvider = ({
  collections: collectionsPromise,
  collectionHosts: collectionHostsPromise,
  users: usersPromise,
  children,
}: Props) => {
  const { data: collections } = use(collectionsPromise);
  const { data: collectionHosts } = use(collectionHostsPromise);
  const { data: users } = use(usersPromise);
  const user = useSessionData().user;

  const setCurrentCustodian = useCustodianStore((s) => s.current.setCustodian);
  const setCollectionHosts = useAdminDataStore((s) => s.setCollectionHosts);
  const setCollections = useAdminDataStore((s) => s.setAllAprovedCollections);
  const setUsers = useAdminDataStore((s) => s.setUsers);

  const isAdmin = checkIsAdmin(user);
  if (user && !isAdmin) {
    redirect("/403?reason=no-admin-access");
  }

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
