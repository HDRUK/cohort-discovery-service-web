"use server";

import getCodes from "./getCodes";
import { codesToOption } from "@/app/utils/omop";

const getOmopDrugs = async () => {
  const codes = await getCodes("drug");
  return codesToOption(codes.data);
};

export default getOmopDrugs;
