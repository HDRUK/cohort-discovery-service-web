"use server";

import getCodes from "./getCodes";
import { codesToOption } from "@/utils/omop";

const getOmopProcedures = async () => {
  const codes = await getCodes("procedure");
  return codesToOption(codes.data);
};

export default getOmopProcedures;
