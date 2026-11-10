"use client";

import { createContext, ReactNode, use, useContext, useMemo } from "react";

import { ApiResponse, Collection, CollectionHost, User } from "@/types/api";

export interface AdminSectionData {
  users: User[];
  collections: Collection[];
  collectionHosts: CollectionHost[];
}

type Props = {
  collections: Promise<ApiResponse<Collection[]>>;
  collectionHosts: Promise<ApiResponse<CollectionHost[]>>;
  users: Promise<ApiResponse<User[]>>;
  children: ReactNode;
};

const AdminSectionContext = createContext<AdminSectionData | null>(null);

export const AdminSectionDataProvider = ({
  value,
  children,
}: {
  value: AdminSectionData;
  children: ReactNode;
}) => (
  <AdminSectionContext.Provider value={value}>
    {children}
  </AdminSectionContext.Provider>
);

export const AdminSectionProvider = ({
  collections: collectionsPromise,
  collectionHosts: collectionHostsPromise,
  users: usersPromise,
  children,
}: Props) => {
  const { data: collections } = use(collectionsPromise);
  const { data: collectionHosts } = use(collectionHostsPromise);
  const { data: users } = use(usersPromise);

  const value = useMemo<AdminSectionData>(
    () => ({ users, collections, collectionHosts }),
    [users, collections, collectionHosts],
  );

  return (
    <AdminSectionDataProvider value={value}>
      {children}
    </AdminSectionDataProvider>
  );
};

export const useAdminSection = (): AdminSectionData | null =>
  useContext(AdminSectionContext);

export const useIsAdminSection = () => {
  return useContext(AdminSectionContext) !== null;
};
