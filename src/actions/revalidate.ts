"use server";

import {
  getCollectionHostTag,
  getCustodianTag,
  getTagCustodianCollection,
  TAG_COLLECTION_HOSTS,
  TAG_COLLECTIONS,
  TAG_COLLECTIONS_ADMIN,
  TAG_COLLECTIONS_USER,
  TAG_CUSTODIANS,
  TAG_NETWORKS,
} from "@/config/tags";
import { getTokenUser } from "@/lib/auth";
import { Custodian } from "@/types/api";
import { updateTag } from "next/cache";

export const revalidateAction = async (tagName: string) => {
  updateTag(tagName);
};

export const revalidateUserAction = async (tagName: string) => {
  const { user } = await getTokenUser();
  const userId = user.id;
  await revalidateAction(`${tagName}-${userId}`);
};

export const revalidateCustodianByPid = async (custodianPid: string) => {
  revalidateAction(getTagCustodianCollection(custodianPid));
};

export const revalidateCustodian = async (custodian: Custodian) => {
  const { pid } = custodian;
  revalidateAction(getCustodianTag(pid));
  revalidateCustodianByPid(pid);
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

export const revalidateNetworks = async () => {
  await revalidateAction(TAG_NETWORKS);
  await revalidateAction(TAG_CUSTODIANS);
  await revalidateCollections();
};
