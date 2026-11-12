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

const useSourceValue = <T,>(source: Source<T> | undefined): T | null => {
  if (source === undefined) return null;
  return source instanceof Promise ? use(source).data : source;
};

export const useAdminUsers = (): User[] | null =>
  useSourceValue(useContext(AdminSectionContext)?.users);

export const useAdminCollections = (): Collection[] | null =>
  useSourceValue(useContext(AdminSectionContext)?.collections);

export const useAdminCollectionHosts = (): CollectionHost[] | null =>
  useSourceValue(useContext(AdminSectionContext)?.collectionHosts);

export const useIsAdminSection = () => {
  return useContext(AdminSectionContext) !== null;
};
