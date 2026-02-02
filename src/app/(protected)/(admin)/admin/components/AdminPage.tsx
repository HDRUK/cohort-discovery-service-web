"use client";

import useCustodianStore from "@/hooks/useCustodianStore";
import useUserStore from "@/hooks/useUserStore";
import { useAdminDataStore } from "@/store/adminDataStore";
import { Collection, CollectionHost, Workgroup } from "@/types/api";
import { checkIsAdmin } from "@/utils/user";
import { forbidden } from "next/navigation";
import { useEffect } from "react";

type Props = {
  collections: Collection[];
  collectionHosts: CollectionHost[];
  workgroups: Workgroup[];
  children: React.ReactNode;
};

const AdminPage = ({
  collections,
  collectionHosts,
  workgroups,
  children,
}: Props) => {
  const user = useUserStore((s) => s.user);
  const setCurrentCustodian = useCustodianStore((s) => s.current.setCustodian);
  const setCollectionHosts = useAdminDataStore((s) => s.setCollectionHosts);
  const setWorkgroups = useAdminDataStore((s) => s.setWorkgroups);
  const setCollections = useAdminDataStore((s) => s.setAllAprovedCollections);

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

  const isAdmin = checkIsAdmin(user);

  if (user && !isAdmin) forbidden();

  return children;
};

export default AdminPage;
