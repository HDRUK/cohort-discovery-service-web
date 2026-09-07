export const MAX_AGE_FILTER = 120;
export const MIN_AGE_FILTER = 0;

import { OmopTableName } from "@/types/omop";
export const VALUE_AS_NUMBER_DOMAINS = new Set<OmopTableName>([
  OmopTableName.Measurement,
]);
