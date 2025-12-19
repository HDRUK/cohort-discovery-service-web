"use server";

import { getCustodianTag, getTagCustodianCollection } from "@/config/tags";
import { getTokenUser } from "@/lib/auth";
import { Custodian } from "@/types/api";
import { updateTag } from "next/cache";

export const revalidateAction = async (tagName: string) => {
  updateTag(tagName);
};

export const revalidateUserAction = async (tagName: string) => {
  const { user } = await getTokenUser();
  const userId = user.id;
  revalidateAction(`${tagName}-${userId}`);
};

export const revalidateCustodianByPid = async (custodianPid: string) => {
  revalidateAction(getTagCustodianCollection(custodianPid));
};

export const revalidateCustodian = async (custodian: Custodian) => {
  const { pid } = custodian;
  revalidateAction(getCustodianTag(pid));
  revalidateCustodianByPid(pid);
};
