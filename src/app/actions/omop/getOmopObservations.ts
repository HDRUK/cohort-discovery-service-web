"use server";

import getCodes from "./getCodes";
import { codesToOption } from "@/utils/omop";

const getOmopObservations = async () => {
  const codes = await getCodes("observation");
  return codesToOption(codes.data);
};

export default getOmopObservations;
