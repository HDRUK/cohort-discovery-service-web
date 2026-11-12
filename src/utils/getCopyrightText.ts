import { cacheLife } from "next/cache";

export const getCopyrightText = async () => {
  "use cache";
  cacheLife("days");

  const copyright = String.fromCodePoint(0x00a9);
  const currentYear = new Date().getFullYear();

  return `${copyright}HDR UK ${currentYear}. All rights reserved.`;
};

export const getCopyrightYear = async (): Promise<number> => {
  "use cache";
  cacheLife("days");

  return new Date().getFullYear();
};
