"use server";

import { updateTag } from "next/cache";

export const revalidateAction = async (tagName: string) => {
  updateTag(tagName);
};
