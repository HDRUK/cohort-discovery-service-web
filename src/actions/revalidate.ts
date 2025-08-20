"use server";

import { revalidateTag } from "next/cache";

export const revalidateAction = async (tagName: string) => {
  revalidateTag(tagName);
};
