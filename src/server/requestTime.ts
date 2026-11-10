import "server-only";

import { connection } from "next/server";

export const requestTime = async (): Promise<number> => {
  await connection();
  return Date.now();
};
