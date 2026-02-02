"use client";

import useCustodianStore from "@/hooks/useCustodianStore";
import useUserStore from "@/hooks/useUserStore";
import { useAdminDataStore } from "@/store/adminDataStore";
import { Collection, CollectionHost, User, Workgroup } from "@/types/api";
import { checkIsAdmin } from "@/utils/user";
import { forbidden } from "next/navigation";
import { useEffect } from "react";

type Props = {
  collections: Collection[];
  collectionHosts: CollectionHost[];
  workgroups: Workgroup[];
  users: User[];
  children: React.ReactNode;
};

const AdminPage = ({
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

  const isAdmin = checkIsAdmin(user);

  if (user && !isAdmin) forbidden();

  return children;
};

export default AdminPage;
