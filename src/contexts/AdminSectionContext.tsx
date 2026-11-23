"use client";

import { createContext, ReactNode, use, useContext, useMemo } from "react";

import { AccessPolicy } from "@/types/accessPolicy";
import {
  ApiResponse,
  Collection,
  CollectionHost,
  User,
  Workgroup,
} from "@/types/api";
import { FeatureOverrides } from "@/types/features";

type Source<T> = Promise<ApiResponse<T>> | T;

export interface AdminSectionData {
  users: User[];
  collections: Collection[];
  collectionHosts: CollectionHost[];
  accessPolicy?: AccessPolicy | null;
  workgroups?: Workgroup[];
  featureOverrides?: FeatureOverrides[];
}

interface AdminSectionSources {
  users: Source<User[]>;
  collections: Source<Collection[]>;
  collectionHosts: Source<CollectionHost[]>;
  accessPolicy?: Promise<AccessPolicy | null> | AccessPolicy | null;
  workgroups?: Source<Workgroup[]>;
  featureOverrides?: Source<FeatureOverrides[]>;
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
  accessPolicy,
  workgroups,
  featureOverrides,
  children,
}: {
  users: Promise<ApiResponse<User[]>>;
  collections: Promise<ApiResponse<Collection[]>>;
  collectionHosts: Promise<ApiResponse<CollectionHost[]>>;
  accessPolicy: Promise<AccessPolicy | null>;
  workgroups: Promise<ApiResponse<Workgroup[]>>;
  featureOverrides: Promise<ApiResponse<FeatureOverrides[]>>;
  children: ReactNode;
}) => {
  const value = useMemo<AdminSectionSources>(
    () => ({
      users,
      collections,
      collectionHosts,
      accessPolicy,
      workgroups,
      featureOverrides,
    }),
    [
      users,
      collections,
      collectionHosts,
      accessPolicy,
      workgroups,
      featureOverrides,
    ],
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

export const useAdminWorkgroups = (): Workgroup[] | null =>
  useSourceValue(useContext(AdminSectionContext)?.workgroups);

export const useAdminFeatureOverrides = (): FeatureOverrides[] | null =>
  useSourceValue(useContext(AdminSectionContext)?.featureOverrides);

export const useAdminAccessPolicy = (): AccessPolicy | null => {
  const source = useContext(AdminSectionContext)?.accessPolicy;
  if (!source) return null;
  return source instanceof Promise ? use(source) : source;
};

export const useIsAdminSection = () => {
  return useContext(AdminSectionContext) !== null;
};
