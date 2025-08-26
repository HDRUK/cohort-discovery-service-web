"use server";
import { cookies } from "next/headers";
import { GATEWAY_TOKEN_NAME } from "@/config/internals";
import { TokenUser } from "@/types/api";
import jwt from "jsonwebtoken";

const TEMP_TOKEN = process.env.TEMP_TOKEN;

const getToken = async (): Promise<User> => {
  const cookieStore = await cookies();
  if (!TEMP_TOKEN) {
    throw new Error("TEMP_TOKEN is not set");
  }

  cookieStore.set(GATEWAY_TOKEN_NAME, TEMP_TOKEN);
  const decoded = jwt.decode(TEMP_TOKEN);
  return decoded.user as TokenUser;
};

export default getToken;
