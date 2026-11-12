"use server";

import {
  getCollectionHostTag,
  getCustodianTag,
  getTagCustodianCollection,
  TAG_ADMIN_USERS,
  TAG_COLLECTION_HOSTS,
  TAG_COLLECTIONS,
  TAG_COLLECTIONS_ADMIN,
  TAG_COLLECTIONS_USER,
  TAG_CUSTODIANS,
  TAG_NETWORKS,
  TAG_WORKGROUP_ADMIN,
} from "@/config/tags";
import { requireSession } from "@/server/session";
import { Custodian } from "@/types/api";
import { updateTag } from "next/cache";

export const revalidateAction = async (tagName: string) => {
  await requireSession();
  updateTag(tagName);
};

export const revalidateUserAction = async (tagName: string) => {
  const { user } = await requireSession();
  const userId = user.id;
  await revalidateAction(`${tagName}-${userId}`);
};

export const revalidateCustodianByPid = async (custodianPid: string) => {
  await revalidateAction(getTagCustodianCollection(custodianPid));
};

export const revalidateCustodian = async (custodian: Custodian) => {
  const { pid } = custodian;
  await Promise.all([
    revalidateAction(getCustodianTag(pid)),
    revalidateCustodianByPid(pid),
  ]);
};

export const revalidateCollections = async (
  pid?: string,
  includeHosts = true,
) =>
  Promise.all([
    revalidateUserAction(TAG_COLLECTIONS_USER),
    revalidateAction(TAG_COLLECTIONS_ADMIN),
    revalidateAction(TAG_COLLECTIONS),
    ...(pid ? [revalidateCustodianByPid(pid)] : []),
    ...(includeHosts
      ? [
          ...(pid ? [revalidateAction(getCollectionHostTag(pid))] : []),
          revalidateAction(TAG_COLLECTION_HOSTS),
        ]
      : []),
  ]);

export const revalidateWorkgroupAndCollections = async (includeUsers = false) =>
  Promise.all([
    revalidateAction(TAG_WORKGROUP_ADMIN),
    revalidateCollections(),
    ...(includeUsers ? [revalidateAction(TAG_ADMIN_USERS)] : []),
  ]);

export const revalidateNetworks = async () =>
  Promise.all([
    revalidateAction(TAG_NETWORKS),
    revalidateAction(TAG_CUSTODIANS),
    revalidateCollections(),
  ]);
