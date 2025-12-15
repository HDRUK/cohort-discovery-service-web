"use server";

import { getTokenUser } from "@/lib/auth";
import { Custodian } from "@/types/api";
import { updateTag } from "next/cache";

export const revalidateAction = async (tagName: string) => {
  updateTag(tagName);
};

export const revalidateUserAction = async (tagName: string) => {
  const { user } = await getTokenUser();
  const userId = user.id;
  revalidateAction(`${userId}-${tagName}`);
};

export const revalidateCustodian = async (custodian: Custodian) => {
  console.log(custodian);
  const { id, pid } = custodian;
  revalidateAction(`custodian-${id}`);
  revalidateAction(`collections-${pid}`);
};
