"use client";

import { createContext, ReactNode, use, useContext, useMemo } from "react";

import { ApiResponse, Collection, CollectionHost, User } from "@/types/api";

type Source<T> = Promise<ApiResponse<T>> | T;

export interface AdminSectionData {
  users: User[];
  collections: Collection[];
  collectionHosts: CollectionHost[];
}

interface AdminSectionSources {
  users: Source<User[]>;
  collections: Source<Collection[]>;
  collectionHosts: Source<CollectionHost[]>;
}

const AdminSectionContext = createContext<AdminSectionSources | null>(null);

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
  users,
  collections,
  collectionHosts,
  children,
}: {
  users: Promise<ApiResponse<User[]>>;
  collections: Promise<ApiResponse<Collection[]>>;
  collectionHosts: Promise<ApiResponse<CollectionHost[]>>;
  children: ReactNode;
}) => {
  const value = useMemo<AdminSectionSources>(
    () => ({ users, collections, collectionHosts }),
    [users, collections, collectionHosts],
  );

  return (
    <AdminSectionContext.Provider value={value}>
      {children}
    </AdminSectionContext.Provider>
  );
};

const useSourceValue = <T,>(source: Source<T>): T =>
  source instanceof Promise ? use(source).data : source;

const useAdminSectionSources = (): AdminSectionSources => {
  const sources = useContext(AdminSectionContext);
  if (!sources)
    throw new Error("Admin section data must be used within the admin section");
  return sources;
};

export const useAdminUsers = (): User[] =>
  useSourceValue(useAdminSectionSources().users);

export const useAdminCollections = (): Collection[] =>
  useSourceValue(useAdminSectionSources().collections);

export const useAdminCollectionHosts = (): CollectionHost[] | null => {
  const hosts = useContext(AdminSectionContext)?.collectionHosts;
  if (hosts === undefined) return null;
  return hosts instanceof Promise ? use(hosts).data : hosts;
};

export const useIsAdminSection = () => {
  return useContext(AdminSectionContext) !== null;
};
