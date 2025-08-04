"use server";

import getCodes from "./getCodes";
import { codesToOption } from "@/app/utils/omop";

const getOmopConditions = async () => {
  const codes = await getCodes("condition");
  return codesToOption(codes.data);
};

export default getOmopConditions;
