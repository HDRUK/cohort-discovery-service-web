"use server";

import getCodes from "./getCodes";
import { codesToOption } from "@/utils/omop";

const getOmopMeasurements = async () => {
  const codes = await getCodes("measurement");
  return codesToOption(codes.data);
};

export default getOmopMeasurements;
